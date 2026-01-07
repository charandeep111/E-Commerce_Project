// src/routes/auth.js – expose registration and login endpoints
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { register, login, getProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;
