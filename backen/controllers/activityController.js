const Activity = require('../models/Activity');
const mongoose = require('mongoose');

class ActivityController {
  // Obtener todas las actividades
  async getAllActivities(req, res) {
    try {
      const { userId, page = 1, limit = 10, category, search } = req.query;
      
      let query = {};
      
      // Filtrar por usuario si se especifica
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({
            success: false,
            error: 'ID de usuario inválido'
          });
        }
        query.userId = new mongoose.Types.ObjectId(userId);
      }

      // Filtrar por categoría si se especifica
      if (category) {
        query.category = category;
      }

      // Búsqueda por texto si se especifica
      if (search) {
        query.$text = { $search: search };
      }

      const activities = await Activity.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      const total = await Activity.countDocuments(query);

      res.json({
        success: true,
        activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error obteniendo actividades:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener una actividad por ID
  async getActivityById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID de actividad inválido'
        });
      }

      const activity = await Activity.findById(id).populate('userId', 'name email');
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          error: 'Actividad no encontrada'
        });
      }

      res.json({
        success: true,
        activity
      });
    } catch (error) {
      console.error('Error obteniendo actividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Crear nueva actividad
  async createActivity(req, res) {
    try {
      const { 
        title, 
        description, 
        character, 
        links, 
        documents, 
        category, 
        difficulty, 
        estimatedTime 
      } = req.body;
      const userId = req.user.userId;

      const newActivity = new Activity({
        title,
        description,
        character: character || '/12.png',
        links: links || [],
        documents: documents || [],
        category: category || 'academic',
        difficulty: difficulty || 'beginner',
        estimatedTime,
        userId
      });

      await newActivity.save();
      await newActivity.populate('userId', 'name email');

      res.status(201).json({
        success: true,
        message: 'Actividad creada exitosamente',
        activity: newActivity
      });
    } catch (error) {
      console.error('Error creando actividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Actualizar actividad
  async updateActivity(req, res) {
    try {
      const { id } = req.params;
      const { 
        title, 
        description, 
        character, 
        links, 
        documents, 
        category, 
        difficulty, 
        estimatedTime 
      } = req.body;
      const userId = req.user.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID de actividad inválido'
        });
      }

      const activity = await Activity.findOneAndUpdate(
        { _id: id, userId },
        { 
          title, 
          description, 
          character, 
          links, 
          documents, 
          category, 
          difficulty, 
          estimatedTime 
        },
        { new: true, runValidators: true }
      ).populate('userId', 'name email');

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: 'Actividad no encontrada o no autorizada'
        });
      }

      res.json({
        success: true,
        message: 'Actividad actualizada exitosamente',
        activity
      });
    } catch (error) {
      console.error('Error actualizando actividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Eliminar actividad
  async deleteActivity(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID de actividad inválido'
        });
      }

      const activity = await Activity.findOneAndDelete({ _id: id, userId });

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: 'Actividad no encontrada o no autorizada'
        });
      }

      res.json({
        success: true,
        message: 'Actividad eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando actividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener categorías disponibles
  async getCategories(req, res) {
    try {
      const categories = ['academic', 'personal', 'professional', 'creative', 'other'];
      res.json({
        success: true,
        categories
      });
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new ActivityController();