const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // Generar JWT token
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  // Registro de usuario
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Ya existe un usuario con este email'
        });
      }

      // Crear nuevo usuario
      const user = new User({
        name,
        email,
        password
      });

      await user.save();

      // Generar token
      const token = this.generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Login de usuario
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await User.findOne({ email }).select('+password');
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Email o contraseña incorrectos'
        });
      }

      // Verificar contraseña
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Email o contraseña incorrectos'
        });
      }

      // Actualizar último login
      await user.updateLastLogin();

      // Generar token
      const token = this.generateToken(user._id);

      res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener perfil del usuario
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Actualizar perfil del usuario
  async updateProfile(req, res) {
    try {
      const { name, profileImage } = req.body;
      const userId = req.user.userId;

      const user = await User.findByIdAndUpdate(
        userId,
        { name, profileImage },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage
        }
      });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new AuthController();