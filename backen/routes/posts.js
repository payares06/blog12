const express = require('express');
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');

const router = express.Router();

// Rutas públicas
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Rutas protegidas
router.post('/', authenticateToken, validatePost, postController.createPost);
router.put('/:id', authenticateToken, validatePost, postController.updatePost);
router.delete('/:id', authenticateToken, postController.deletePost);
router.post('/:id/like', authenticateToken, postController.toggleLike);

module.exports = router;