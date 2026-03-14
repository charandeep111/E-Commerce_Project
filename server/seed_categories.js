// server/seed_categories.js - Clean seed with proper ObjectId relationships
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./src/models/Category');
const Subcategory = require('./src/models/Subcategory');

dotenv.config();

const SEED_DATA = [
    {
        name: 'Electronics',
        slug: 'electronics',
        subcategories: [
            { name: 'Mobile Phones', slug: 'mobile-phones' },
            { name: 'Laptops', slug: 'laptops' },
            { name: 'Headphones', slug: 'headphones' },
            { name: 'Smartwatches', slug: 'smartwatches' },
        ],
    },
    {
        name: 'Jewellery',
        slug: 'jewellery',
        subcategories: [
            { name: 'Rings', slug: 'rings' },
            { name: 'Necklaces', slug: 'necklaces' },
            { name: 'Bracelets', slug: 'bracelets' },
        ],
    },
    {
        name: 'Baby',
        slug: 'baby',
        subcategories: [
            { name: 'Diapers', slug: 'diapers' },
            { name: 'Toys', slug: 'toys' },
            { name: 'Baby Clothing', slug: 'baby-clothing' },
        ],
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        // Step 1: Wipe ALL existing categories & subcategories
        await Category.deleteMany({});
        await Subcategory.deleteMany({});
        console.log('Cleared all existing categories & subcategories.\n');

        // Step 2: Create categories AND their subcategories with correct ObjectId refs
        for (const catData of SEED_DATA) {
            const category = await Category.create({
                name: catData.name,
                slug: catData.slug,
            });
            console.log(`Created Category: "${category.name}" (_id: ${category._id})`);

            for (const subData of catData.subcategories) {
                const sub = await Subcategory.create({
                    name: subData.name,
                    slug: subData.slug,
                    categoryId: category._id, // <-- THE CRITICAL LINK
                });
                console.log(`  └─ Subcategory: "${sub.name}" (categoryId: ${sub.categoryId})`);
            }
            console.log('');
        }

        // Step 3: Verification — for each category, query its subcategories
        console.log('═══ VERIFICATION ═══\n');
        const allCategories = await Category.find({});
        for (const cat of allCategories) {
            const subs = await Subcategory.find({ categoryId: cat._id });
            console.log(`"${cat.name}" (${cat._id}) → ${subs.length} subcategories:`);
            subs.forEach(s => console.log(`    • ${s.name} (categoryId: ${s.categoryId})`));

            // Verify the categoryId matches
            const mismatch = subs.filter(s => s.categoryId.toString() !== cat._id.toString());
            if (mismatch.length > 0) {
                console.log(`    ⚠ WARNING: ${mismatch.length} subcategories have WRONG categoryId!`);
            } else {
                console.log(`    ✓ All subcategories correctly linked.`);
            }
            console.log('');
        }

        console.log('Seed complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
