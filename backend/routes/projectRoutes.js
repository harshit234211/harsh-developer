const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { validateProject } = require('../middleware/validator');

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', protect, validateProject, createProject);
router.put('/:id', protect, validateProject, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
