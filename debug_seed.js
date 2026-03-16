const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

async function debug() {
    try {
        dotenv.config();
        console.log('URI:', process.env.MONGODB_URI ? 'FOUND' : 'NOT FOUND');
        
        const Category = require('./server/src/models/Category');
        const Subcategory = require('./server/src/models/Subcategory');
        const Product = require('./server/src/models/Product');
        const User = require('./server/src/models/User');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');
        
        await Category.deleteMany({});
        console.log('Categories deleted');
        
        process.exit(0);
    } catch (err) {
        console.error('FULL_ERROR:', err);
        process.exit(1);
    }
}

debug();
