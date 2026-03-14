const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnection = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log('Testing connection to:', uri ? 'URI exists' : 'URI MISSING');
    try {
        await mongoose.connect(uri);
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE:', err.message);
        process.exit(1);
    }
};

testConnection();
