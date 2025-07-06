const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    minlength: [10, 'El contenido debe tener al menos 10 caracteres'],
    maxlength: [5000, 'El contenido no puede exceder 5000 caracteres']
  },
  date: {
    type: String,
    required: true,
    default: function() {
      return new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  },
  image: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Índices para optimizar consultas
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ isPublished: 1, createdAt: -1 });
postSchema.index({ title: 'text', content: 'text' });

// Método para incrementar vistas
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Método para agregar/quitar like
postSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => like.userId.toString() === userId.toString());
  
  if (existingLike) {
    this.likes = this.likes.filter(like => like.userId.toString() !== userId.toString());
  } else {
    this.likes.push({ userId });
  }
  
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);