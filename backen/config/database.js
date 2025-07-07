const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      if (this.connection) {
        console.log('✅ Using existing database connection');
        return this.connection;
      }

      // Configuración moderna para MongoDB (sin opciones deprecadas)
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Usar IPv4
        bufferCommands: false,
        bufferMaxEntries: 0
      };

      // Intentar conectar con la URI principal
      let mongoUri = process.env.MONGODB_URI;
      
      if (!mongoUri) {
        console.log('⚠️  No se encontró MONGODB_URI, usando MongoDB local...');
        mongoUri = 'mongodb://127.0.0.1:27017/mypersonalblog';
      }

      console.log('🔄 Conectando a MongoDB...');
      console.log('🌐 URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciales
      
      this.connection = await mongoose.connect(mongoUri, options);
      
      console.log('✅ Connected to MongoDB successfully');
      console.log(`📊 Database: ${this.connection.connection.name}`);
      console.log(`🌐 Host: ${this.connection.connection.host}`);
      
      // Configurar eventos de conexión
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('🔌 MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });
      
      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      
      // Si falla la conexión principal, intentar con MongoDB local
      if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv')) {
        console.log('🔄 Intentando conectar a MongoDB local como fallback...');
        
        try {
          const localUri = 'mongodb://127.0.0.1:27017/mypersonalblog';
          const localOptions = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
          };
          
          this.connection = await mongoose.connect(localUri, localOptions);
          console.log('✅ Connected to local MongoDB');
          return this.connection;
        } catch (localError) {
          console.error('❌ Local MongoDB connection failed:', localError.message);
          this.showConnectionHelp();
          process.exit(1);
        }
      } else {
        this.showConnectionHelp();
        process.exit(1);
      }
    }
  }

  showConnectionHelp() {
    console.log('\n💡 SOLUCIONES PARA CONECTAR A MONGODB:');
    console.log('\n🌐 OPCIÓN 1: MongoDB Atlas (Nube - Recomendado)');
    console.log('   1. Ve a: https://www.mongodb.com/atlas');
    console.log('   2. Crea una cuenta gratuita');
    console.log('   3. Crea un cluster gratuito');
    console.log('   4. Obtén la cadena de conexión');
    console.log('   5. Actualiza MONGODB_URI en el archivo .env');
    
    console.log('\n💻 OPCIÓN 2: MongoDB Local');
    console.log('   1. Descargar desde: https://www.mongodb.com/try/download/community');
    console.log('   2. Instalar y ejecutar como servicio');
    console.log('   3. Usar MongoDB Compass para gestión visual');
    
    console.log('\n🐳 OPCIÓN 3: Docker (Rápido)');
    console.log('   docker run -d -p 27017:27017 --name mongodb mongo:latest');
    
    console.log('\n🔧 CONFIGURACIÓN ACTUAL:');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'Configurado' : 'No configurado'}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log('\n');
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        this.connection = null;
        console.log('🔌 Disconnected from MongoDB');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error.message);
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = new Database();