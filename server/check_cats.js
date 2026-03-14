const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');

dotenv.config();

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const categories = await Product.distinct('category');
        console.log('Available Categories in DB:', categories);
        
        const counts = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        console.log('Category Counts:', JSON.stringify(counts, null, 2));
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkCategories();
