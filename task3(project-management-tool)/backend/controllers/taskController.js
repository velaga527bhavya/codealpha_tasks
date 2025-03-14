const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo } = req.body;
    const newTask = new Task({
      title,
      description,
      project,
      assignedTo,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    // Use 'createdAt' field (as defined in the CommentSchema) instead of 'date'
    task.comments.push({ text, postedBy: req.user.id, createdAt: new Date() });
    await task.save();
    
    // Populate the postedBy field for the comments before sending response
    const populatedTask = await Task.findById(req.params.id)
      .populate('comments.postedBy', 'username');
    res.json(populatedTask);
  } catch (error) {
    console.error("addComment error:", error);
    res.status(500).json({ error: error.message });
  }
};


