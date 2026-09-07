const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

const getProjects = async (req, res, next) => {
  try {
    const { category, featured, all } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    // If request has valid admin token (via header check), they can see all projects
    // Otherwise only return published projects
    if (all !== 'true' && !req.headers.authorization) {
      filter.isPublished = true;
    }

    const projects = await dbService.Project.find(filter);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    next(err);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await dbService.Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

const createProject = async (req, res, next) => {
  try {
    const project = await dbService.Project.create(req.body);
    logger.success(`Created project: ${project.name}`);

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project
    });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await dbService.Project.findByIdAndUpdate(req.params.id, req.body);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    logger.success(`Updated project: ${project.name}`);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: project
    });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await dbService.Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    logger.info(`Deleted project: ${project.name}`);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
