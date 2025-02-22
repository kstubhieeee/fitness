const express = require('express');
const router = express.Router();
const { registerMember, loginMember, getMemberDetails } = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware'); // To verify JWT token

// Register route
router.post('/register', registerMember);

// Login route
router.post('/login', loginMember);

// Get member details (with JWT token authentication)
router.get('/me', authMiddleware, getMemberDetails);

module.exports = router;
