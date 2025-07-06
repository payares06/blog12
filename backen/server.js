const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Importar configuraciones y utilidades
const database = require('./config/database');
const logger = require('./utils/logger');

// Importar rutas
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const activityRoutes = require('./routes/activities');
const imageRoutes = require('./routes/images');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeMiddlewares() {
    // Seguridad
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // máximo 100 requests por ventana de tiempo
      message: {
        success: false,
        error: 'Demasiadas solicitudes, intenta de nuevo más tarde'
      }
    });
    this.app.use('/api/', limiter);

    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Compresión
    this.app.use(compression());

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Body parsing
    this.app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf) => {
        try {
          JSON.parse(buf);
        } catch (e) {
          res.status(400).json({
            success: false,
            error: 'JSON inválido'
          });
          throw new Error('JSON inválido');
        }
      }
    }));
    
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb' 
    }));

    // Headers de seguridad adicionales
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  initializeRoutes() {
    // Ruta de salud
    this.app.get('/api/health', (req, res) => {
      res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0'
      });
    });

    // Rutas principales
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/posts', postRoutes);
    this.app.use('/api/activities', activityRoutes);
    this.app.use('/api/images', imageRoutes);

    // Ruta para servir archivos estáticos (si es necesario)
    this.app.use('/uploads', express.static('uploads'));

    // Manejo de rutas no encontradas
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });
  }

  initializeErrorHandling() {
    // Manejo global de errores
    this.app.use((error, req, res, next) => {
      logger.error('Error no manejado:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
      });

      // Error de validación de Mongoose
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: 'Error de validación',
          details: errors
        });
      }

      // Error de duplicado de MongoDB
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
          success: false,
          error: `Ya existe un registro con ese ${field}`
        });
      }

      // Error de cast de MongoDB
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'ID inválido'
        });
      }

      // Error genérico
      res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
    });
  }

  async start() {
    try {
      // Conectar a la base de datos
      await database.connect();
      
      // Iniciar servidor
      this.app.listen(this.port, () => {
        logger.info(`🚀 Servidor iniciado en puerto ${this.port}`);
        logger.info(`📡 API disponible en http://localhost:${this.port}/api`);
        logger.info(`🌍 Entorno: ${process.env.NODE_ENV}`);
        logger.info(`📊 Base de datos: Conectada`);
      });

      // Manejo de cierre graceful
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      logger.error('Error iniciando servidor:', error);
      process.exit(1);
    }
  }

  async gracefulShutdown(signal) {
    logger.info(`🔄 Recibida señal ${signal}. Cerrando servidor...`);
    
    try {
      await database.disconnect();
      logger.info('✅ Servidor cerrado correctamente');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error cerrando servidor:', error);
      process.exit(1);
    }
  }
}

// Inicializar y arrancar servidor
const server = new Server();
server.start();

module.exports = server;