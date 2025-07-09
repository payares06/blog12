const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Token de acceso requerido' 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(403).json({ 
          success: false,
          error: 'Token inválido' 
        });
      }
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(403).json({ 
          success: false,
          error: 'Token expirado' 
        });
      }
      
      throw jwtError;
    }
    
    // Verificar que el usuario aún existe
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false,
        error: 'Usuario no válido o inactivo' 
      });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    next();
  } catch (error) {

    console.error('Error en autenticación:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Acceso denegado. Se requieren permisos de administrador' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};