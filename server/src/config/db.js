// src/config/db.js – MongoDB connection helper
const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error (non‑fatal):', err.message);
        // Continue without terminating so the server can still run for route testing
    }
};

module.exports = connectDB;
