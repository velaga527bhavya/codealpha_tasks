const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const project = new Project({
      name,
      description,
      createdBy: req.user.id,
      members: members && members.length ? members : [req.user.id]
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id })
      .populate('createdBy', 'username email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
