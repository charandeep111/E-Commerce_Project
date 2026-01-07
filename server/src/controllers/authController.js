// src/controllers/authController.js – Handles registration and login
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// @desc   Register a new user (customer or vendor)
// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
    const { name, email, password, role, vendorDetails } = req.body;
    if (!['customer', 'vendor'].includes(role)) {
        return res.status(400).json({ msg: 'Invalid role' });
    }
    try {
        const user = new User({ name, email, password, role, vendorDetails });
        await user.save();
        const token = generateToken(user);
        res.status(201).json({ token, user: { id: user._id, name, email, role } });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc   Login existing user
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ msg: 'Invalid credentials' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });
        const token = generateToken(user);
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
// @desc   Get current user profile
// @route  GET /api/auth/profile
// @access Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
