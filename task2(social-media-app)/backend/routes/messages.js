const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiver, content } = req.body;
    
    // Validate that the receiver is provided and is a valid ObjectId.
    if (!receiver || !mongoose.Types.ObjectId.isValid(receiver)) {
      console.error('Invalid or missing receiver:', receiver);
      return res.status(400).json({ error: 'Invalid or missing receiver ID' });
    }
    
    // Validate that the message content is provided.
    if (!content || content.trim() === '') {
      console.error('Content is missing.');
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const message = new Message({
      sender: req.user.id,
      receiver,
      content
    });
    
    await message.save();
    console.log('Message saved:', message);  // This log should appear in your command prompt if saved.
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




