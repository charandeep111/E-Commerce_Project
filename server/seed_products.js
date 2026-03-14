// server/seed_products.js - Seed products for new category structure
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./src/models/Category');
const Subcategory = require('./src/models/Subcategory');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get a vendor (User) to assign products to
        let vendor = await User.findOne({ role: 'vendor' });
        if (!vendor) {
            vendor = await User.findOne({}); // Fallback to any user
        }
        
        if (!vendor) {
            console.error('No user found to assign as vendor. Please create a user first.');
            process.exit(1);
        }

        console.log(`Using vendor: ${vendor.email} (${vendor._id})`);

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Helper to find subcat by name
        const findSub = async (name) => await Subcategory.findOne({ name }).populate('categoryId');

        const productData = [
            // Electronics -> Mobile Phones
            { title: 'iPhone 15 Pro', price: 999, description: 'Latest Apple iPhone', subName: 'Mobile Phones' },
            { title: 'Samsung Galaxy S24', price: 899, description: 'Flagship Android phone', subName: 'Mobile Phones' },
            
            // Electronics -> Laptops
            { title: 'MacBook Air M2', price: 1199, description: 'Thin and light laptop', subName: 'Laptops' },
            { title: 'Dell XPS 13', price: 1099, description: 'Premium Windows ultrabook', subName: 'Laptops' },
            
            // Jewellery -> Rings
            { title: 'Diamond Engagement Ring', price: 2500, description: '18k White Gold diamond ring', subName: 'Rings' },
            { title: 'Gold Band', price: 400, description: 'Simple 24k gold band', subName: 'Rings' },
            
            // Baby -> Toys
            { title: 'LEGO Duplo Set', price: 29, description: 'Building blocks for toddlers', subName: 'Toys' },
            { title: 'Plush Teddy Bear', price: 15, description: 'Soft cuddly toy', subName: 'Toys' }
        ];

        for (const p of productData) {
            const sub = await findSub(p.subName);
            if (sub) {
                await Product.create({
                    title: p.title,
                    price: p.price,
                    description: p.description,
                    vendorId: vendor._id,
                    categoryId: sub.categoryId._id,
                    subcategoryId: sub._id,
                    category: sub.categoryId.name, // Legacy support
                    subCategory: sub.name,         // Legacy support
                    stock: 50,
                    images: [{ url: 'https://via.placeholder.com/300', public_id: 'placeholder' }]
                });
                console.log(`Created Product: ${p.title} in ${sub.name}`);
            } else {
                console.warn(`Subcategory not found: ${p.subName}`);
            }
        }

        console.log('Product seed complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
