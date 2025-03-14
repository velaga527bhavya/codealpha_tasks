const express = require('express');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createPost, getPosts, likePost, getUserPosts } = require('../controllers/postController');

// Configure Multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create a new post (with optional image)
router.post('/', authMiddleware, upload.single('image'), createPost);

// Get all posts
router.get('/', authMiddleware, getPosts);

// Get posts for a specific user
router.get('/user/:userId', authMiddleware, getUserPosts);

// Like a post
router.put('/like/:postId', authMiddleware, likePost);

module.exports = router;



