const express = require('express');
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();

// Rutas públicas
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Rutas protegidas
router.post('/', authenticateToken, validatePost, postController.createPost);
router.put('/:id', authenticateToken, validatePost, postController.updatePost);
router.delete('/:id', authenticateToken, postController.deletePost);
router.post('/:id/like', authenticateToken, postController.toggleLike);

// Rutas para comentarios
router.post('/:id/comments', authenticateToken, postController.addComment);
router.delete('/:id/comments/:commentId', authenticateToken, postController.deleteComment);

// Rutas para subir archivos
router.post('/:id/upload-image', 
  authenticateToken, 
  upload.single('image'), 
  handleMulterError, 
  postController.uploadPostImage
);

router.post('/:id/upload-document', 
  authenticateToken, 
  upload.single('document'), 
  handleMulterError, 
  postController.uploadPostDocument
);

// Rutas para eliminar archivos
router.delete('/:id/images/:imageId', authenticateToken, postController.deletePostImage);
router.delete('/:id/documents/:documentId', authenticateToken, postController.deletePostDocument);

module.exports = router;