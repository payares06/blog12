const Post = require('../models/Post');
const mongoose = require('mongoose');

class PostController {
  // Obtener todos los posts
  async getAllPosts(req, res) {
    try {
      const { userId, page = 1, limit = 10, search } = req.query;
      
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

      // Búsqueda por texto si se especifica
      if (search) {
        query.$text = { $search: search };
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: {
          path: 'userId',
          select: 'name email'
        }
      };

      const posts = await Post.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      const total = await Post.countDocuments(query);

      res.json({
        success: true,
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error obteniendo posts:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener un post por ID
  async getPostById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID de post inválido'
        });
      }

      const post = await Post.findById(id).populate('userId', 'name email');
      
      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post no encontrado'
        });
      }

      // Incrementar vistas
      await post.incrementViews();

      res.json({
        success: true,
        post
      });
    } catch (error) {
      console.error('Error obteniendo post:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Crear nuevo post
  async createPost(req, res) {
    try {
      const { title, content, date, image, tags } = req.body;
      const userId = req.user.userId;

      const newPost = new Post({
        title,
        content,
        date: date || new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        image: image || '',
        tags: tags || [],
        userId
      });

      await newPost.save();
      await newPost.populate('userId', 'name email');

      res.status(201).json({
        success: true,
        message: 'Post creado exitosamente',
        post: newPost
      });
    } catch (error) {
      console.error('Error creando post:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Actualizar post
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, content, date, image, tags } = req.body;
      const userId = req.user.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID de post inválido'
        });
      }

      const post = await Post.findOneAndUpdate(
        { _id: id, userId },
        { title, content, date, image, tags },
        { new: true, runValidators: true }
      ).populate('userId', 'name email');

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post no encontrado o no autorizado'
        });
      }

      res.json({
        success: true,
        message: 'Post actualizado exitosamente',
        post
      });
    } catch (error) {
      console.error('Error actualizando post:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Eliminar post
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID de post inválido'
        });
      }

      const post = await Post.findOneAndDelete({ _id: id, userId });

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post no encontrado o no autorizado'
        });
      }

      res.json({
        success: true,
        message: 'Post eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando post:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Toggle like en post
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID de post inválido'
        });
      }

      const post = await Post.findById(id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post no encontrado'
        });
      }

      await post.toggleLike(userId);

      res.json({
        success: true,
        message: 'Like actualizado exitosamente',
        likesCount: post.likes.length
      });
    } catch (error) {
      console.error('Error actualizando like:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new PostController();