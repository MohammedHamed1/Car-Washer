const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification.controller');
const auth = require('../../middleware/auth');

// Get all notifications for current user
router.get('/', auth, notificationController.getNotifications);

// Get specific notification by ID
router.get('/:id', auth, notificationController.getNotification);

// Create new notification
router.post('/', auth, notificationController.createNotification);

// Mark notification as read
router.post('/:id/mark-read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.post('/mark-all-read', auth, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router; 