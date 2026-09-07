const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

// Duplicate submission tracker (in-memory sliding window)
const recentSubmissions = new Map();

const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, whatsapp, service, budget, projectType, deadline, description, message, referenceUrl } = req.body;

    // Check duplicate rapid submissions within 60s
    const submissionKey = `${email.toLowerCase()}_${description.slice(0, 30)}`;
    const now = Date.now();
    if (recentSubmissions.has(submissionKey)) {
      const lastTime = recentSubmissions.get(submissionKey);
      if (now - lastTime < 60000) {
        return res.status(429).json({
          success: false,
          message: 'You have already submitted this project enquiry recently. Harshit has received your request and will contact you shortly!'
        });
      }
    }
    recentSubmissions.set(submissionKey, now);

    const enquiry = await dbService.Enquiry.create({
      name,
      email,
      phone,
      whatsapp: whatsapp || phone,
      service,
      budget,
      projectType,
      deadline,
      description,
      message,
      referenceUrl
    });

    logger.success(`New project enquiry received from: ${name} (${email}) for service "${service}"`);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your project enquiry has been submitted successfully. Harshit will review your details and respond via Email or WhatsApp shortly.',
      enquiryId: enquiry._id
    });
  } catch (err) {
    next(err);
  }
};

const getEnquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.search = search;
    }

    const enquiries = await dbService.Enquiry.find(filter);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (err) {
    next(err);
  }
};

const getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await dbService.Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (err) {
    next(err);
  }
};

const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const enquiry = await dbService.Enquiry.findByIdAndUpdate(req.params.id, updateData);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.'
      });
    }

    logger.info(`Updated enquiry status for ${enquiry.name} to "${status}"`);

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully.',
      data: enquiry
    });
  } catch (err) {
    next(err);
  }
};

const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await dbService.Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.'
      });
    }

    logger.info(`Deleted enquiry from ${enquiry.name}`);

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const totalEnquiries = await dbService.Enquiry.countDocuments();
    const newEnquiries = await dbService.Enquiry.countDocuments({ status: 'New' });
    const inProgress = await dbService.Enquiry.countDocuments({ status: 'In Progress' });
    const completed = await dbService.Enquiry.countDocuments({ status: 'Completed' });
    const contacted = await dbService.Enquiry.countDocuments({ status: 'Contacted' });
    const cancelled = await dbService.Enquiry.countDocuments({ status: 'Cancelled' });
    const totalProjects = await dbService.Project.countDocuments();

    const totalClients = await dbService.User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalEnquiries,
        newEnquiries,
        inProgress,
        completed,
        contacted,
        cancelled,
        totalProjects,
        totalClients,
        dbEngine: dbService.getEngine()
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
  getStats
};
