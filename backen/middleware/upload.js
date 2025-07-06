const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido. Solo se permiten: ${allowedTypes.join(', ')}`), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB por defecto
    files: 1 // Solo un archivo a la vez
  },
  fileFilter: fileFilter
});

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'El archivo es demasiado grande. Máximo 5MB permitido'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Demasiados archivos. Solo se permite un archivo'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Campo de archivo inesperado'
        });
      default:
        return res.status(400).json({
          success: false,
          error: 'Error en la carga del archivo'
        });
    }
  }
  
  if (error.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
};

module.exports = {
  upload,
  handleMulterError
};