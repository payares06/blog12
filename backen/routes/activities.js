const express = require('express');
const activityController = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/auth');
const { validateActivity } = require('../middleware/validation');

const router = express.Router();

// Rutas públicas
router.get('/', activityController.getAllActivities);
router.get('/categories', activityController.getCategories);
router.get('/:id', activityController.getActivityById);

// Rutas protegidas
router.post('/', authenticateToken, validateActivity, activityController.createActivity);
router.put('/:id', authenticateToken, validateActivity, activityController.updateActivity);
router.delete('/:id', authenticateToken, activityController.deleteActivity);

module.exports = router;