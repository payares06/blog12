const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  character: {
    type: String,
    default: '/12.png'
  },
  links: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'El enlace debe ser una URL válida'
    }
  }],
  documents: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'txt', 'image', 'other'],
      default: 'other'
    },
    size: {
      type: Number
    }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['academic', 'personal', 'professional', 'creative', 'other'],
    default: 'academic'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedTime: {
    type: Number, // en minutos
    min: 0
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ isPublished: 1, category: 1 });
activitySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Activity', activitySchema);