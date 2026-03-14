const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');

dotenv.config();

const fixCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // 1. Fitness Equipment
        const fitnessRes = await Product.updateMany(
            { category: { $in: ['Sports', 'Sports & Fitness'] } },
            { $set: { category: 'Fitness Equipment' } }
        );
        console.log(`Updated ${fitnessRes.modifiedCount} products to Fitness Equipment`);
        
        // 2. Electronics (should already be fine, but let's ensure consistency)
        const electronicsRes = await Product.updateMany(
            { category: { $in: ['Mobiles', 'Laptops', 'Headphones', 'Mobiles & Tablets', 'TV & Appliances'] } },
            { $set: { category: 'Electronics' } }
        );
        console.log(`Updated ${electronicsRes.modifiedCount} products to Electronics`);
        
        // 3. Accessories
        const accessoriesRes = await Product.updateMany(
            { category: { $in: ['Beauty', 'Beauty & Personal Care', 'Fashion'] }, subCategory: /Acc/i },
            { $set: { category: 'Accessories' } }
        );
        console.log(`Updated ${accessoriesRes.modifiedCount} products to Accessories`);
        
        // If still no Accessories, let's just convert some Fashion products
        if (accessoriesRes.modifiedCount === 0) {
            const fashionToAcc = await Product.updateMany(
                { category: 'Fashion' },
                { $set: { category: 'Accessories' } }
            );
             console.log(`Updated ${fashionToAcc.modifiedCount} Fashion products to Accessories`);
        }
        
        // 4. Watches (ensure it's capitalized correctly and search titles)
        const watchesRes = await Product.updateMany(
            { $or: [{ category: /watch/i }, { title: /watch/i }] },
            { $set: { category: 'Watches' } }
        );
        console.log(`Updated ${watchesRes.modifiedCount} products to Watches`);

        console.log('Category fix complete.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixCategories();
