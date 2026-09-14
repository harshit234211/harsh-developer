const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

/**
 * 1. Get recent notifications for Admin
 * GET /api/admin/notifications
 */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await dbService.Notification.find({});
    
    // Sort newest first
    notifications.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const unreadCount = notifications.filter(n => !n.read).length;

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications: notifications.slice(0, 50)
    });
  } catch (err) {
    logger.error('Failed to get notifications: ' + err.message);
    next(err);
  }
};

/**
 * 2. Get unread notification count
 * GET /api/admin/notifications/unread-count
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const notifications = await dbService.Notification.find({ read: false });
    res.status(200).json({
      success: true,
      unreadCount: notifications.length
    });
  } catch (err) {
    logger.error('Failed to get unread count: ' + err.message);
    next(err);
  }
};

/**
 * 3. Mark single notification as read
 * PATCH /api/admin/notifications/:id/read
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await dbService.Notification.findByIdAndUpdate(id, { read: true }, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      notification: updated
    });
  } catch (err) {
    logger.error('Failed to mark notification read: ' + err.message);
    next(err);
  }
};

/**
 * 4. Mark all notifications as read
 * POST /api/admin/notifications/mark-all-read
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const notifications = await dbService.Notification.find({ read: false });
    
    for (const notif of notifications) {
      const nid = notif._id || notif.id;
      await dbService.Notification.findByIdAndUpdate(nid, { read: true });
    }

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
      updatedCount: notifications.length
    });
  } catch (err) {
    logger.error('Failed to mark all notifications read: ' + err.message);
    next(err);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};
