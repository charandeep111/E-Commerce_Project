// src/config/db.js – MongoDB connection helper
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log('Attempting to connect to MongoDB with URI:', uri ? 'URI provided (masked)' : 'URI MISSING');

    if (!uri) {
        console.error('CRITICAL: MONGODB_URI/MONGO_URI is not defined in environment variables.');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('SUCCESS: MongoDB connected to Atlas');
    } catch (err) {
        console.error('ERROR: MongoDB connection failure:', err.message);
        throw err; // Re-throw to prevent server startup
    }
};

module.exports = connectDB;
