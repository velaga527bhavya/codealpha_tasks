const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new task under a project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, project, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      project,
      assignedTo
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task (status, assignment, etc.)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a comment to a task
router.put('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    task.comments.push({ text, postedBy: req.user.id });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const tasks = await require('../models/Task').find({ project: req.params.projectId })
      .populate('assignedTo', 'username')
      .populate('comments.postedBy', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
