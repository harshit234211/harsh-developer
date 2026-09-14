const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

/**
 * 1. Submit Feature Request / Bug Report / Feedback
 * POST /api/feedback
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { title, category, description, priority } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a descriptive title (minimum 3 characters).'
      });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a detailed description (minimum 10 characters).'
      });
    }

    const validCategories = ['feature_request', 'product_suggestion', 'bug_report', 'service_request', 'feedback'];
    const selectedCategory = validCategories.includes(category) ? category : 'feature_request';

    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    const selectedPriority = validPriorities.includes(priority) ? priority : 'Medium';

    const userName = req.user ? req.user.name : (req.body.name || 'Anonymous Guest');
    const userEmail = req.user ? req.user.email : (req.body.email || '');
    const userId = req.user ? (req.user._id || req.user.id) : null;

    const newFeedback = await dbService.FeatureRequest.create({
      title: title.trim(),
      category: selectedCategory,
      description: description.trim(),
      priority: selectedPriority,
      status: 'New',
      userName,
      userEmail,
      userId,
      adminNotes: ''
    });

    // Trigger Admin In-App Notification
    try {
      const isBug = selectedCategory === 'bug_report';
      await dbService.Notification.create({
        type: isBug ? 'bug_report' : 'feature_request',
        title: isBug ? `New Bug Report: ${title.trim()}` : `New Feature Idea: ${title.trim()}`,
        message: `${userName} (${userEmail || 'guest'}) submitted: "${title.trim()}". Priority: ${selectedPriority}`,
        link: '#feedback',
        metadata: { feedbackId: newFeedback._id || newFeedback.id, category: selectedCategory, priority: selectedPriority },
        read: false
      });
    } catch (notifErr) {
      logger.warn(`Could not dispatch feedback notification: ${notifErr.message}`);
    }

    logger.success(`[Feedback] New ${selectedCategory} recorded: "${title.trim()}" from ${userEmail || 'guest'}`);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been submitted directly to the DevCraft engineering roadmap.',
      feedback: newFeedback
    });
  } catch (err) {
    logger.error('Failed to submit feedback: ' + err.message);
    next(err);
  }
};

/**
 * 2. Get client's own submitted requests
 * GET /api/feedback/my-requests
 */
const getMyFeedback = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const userEmail = req.user.email;

    const allRequests = await dbService.FeatureRequest.find({});
    const myRequests = allRequests.filter(r => 
      (r.userId && String(r.userId) === String(userId)) ||
      (r.userEmail && r.userEmail.toLowerCase() === userEmail.toLowerCase())
    );

    res.status(200).json({
      success: true,
      count: myRequests.length,
      requests: myRequests
    });
  } catch (err) {
    logger.error('Failed to get user feedback: ' + err.message);
    next(err);
  }
};

/**
 * 3. Admin: Get all feedback with filtering
 * GET /api/admin/feedback
 */
const getAllFeedbackAdmin = async (req, res, next) => {
  try {
    const { category, status, priority } = req.query;
    let list = await dbService.FeatureRequest.find({});

    if (category && category !== 'All') {
      list = list.filter(item => item.category === category);
    }
    if (status && status !== 'All') {
      list = list.filter(item => item.status === status);
    }
    if (priority && priority !== 'All') {
      list = list.filter(item => item.priority === priority);
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.status(200).json({
      success: true,
      count: list.length,
      feedback: list
    });
  } catch (err) {
    logger.error('Failed to get feedback roster: ' + err.message);
    next(err);
  }
};

/**
 * 4. Admin: Update status or notes
 * PATCH /api/admin/feedback/:id
 */
const updateFeedbackAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, priority } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;
    if (priority) updateFields.priority = priority;

    const updated = await dbService.FeatureRequest.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Feedback item not found.'
      });
    }

    logger.info(`[Feedback Updated] ID ${id} set to status: ${status || 'unchanged'}`);

    res.status(200).json({
      success: true,
      message: 'Feedback item updated successfully.',
      feedback: updated
    });
  } catch (err) {
    logger.error('Failed to update feedback item: ' + err.message);
    next(err);
  }
};

module.exports = {
  submitFeedback,
  getMyFeedback,
  getAllFeedbackAdmin,
  updateFeedbackAdmin
};
