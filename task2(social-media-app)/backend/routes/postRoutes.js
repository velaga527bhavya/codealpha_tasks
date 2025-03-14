const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

// Configure Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this directory exists in your backend root
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Create a post with an optional image upload
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    let imagePath = '';
    if (req.file) {
      // Build the full URL for the uploaded image
      imagePath = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const post = new Post({
      user: req.user.id,
      content,
      image: imagePath,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user')
      .populate('comments.user');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get posts by user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/unlike a post
router.put('/like/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.user.id)) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a comment to a post
router.put('/comment/:id', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id).populate('comments.user');
    post.comments.push({ user: req.user.id, text });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



