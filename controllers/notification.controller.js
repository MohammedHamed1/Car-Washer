const Notification = require('./notification.model');

// Get all notifications for current user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get specific notification by ID
exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new notification
exports.createNotification = async (req, res) => {
  try {
    const { type, message, relatedWash } = req.body;
    
    const notification = new Notification({
      user: req.user.userId,
      type,
      message,
      relatedWash,
      isRead: false
    });
    
    await notification.save();
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.userId, isRead: false },
      { isRead: true }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 