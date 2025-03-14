const express = require('express');
const router = express.Router();
const { getUserProfile, getUserByUsername, toggleFollow } = require('../controllers/userController');

// Get user profile by ID
router.get('/:userId', getUserProfile);

// Get user by username
router.get('/username/:username', getUserByUsername);

// Toggle follow/unfollow a user
router.put('/follow/:id', toggleFollow);

module.exports = router;

