/**
 * seed_categories.js – Seeds Category, Subcategory, and migrates existing Products
 * 
 * Run: node server/scripts/seed_categories.js
 * 
 * This script:
 * 1. Creates normalized Category documents
 * 2. Creates Subcategory documents with correct categoryId references
 * 3. Migrates existing products to use ObjectId references
 * 4. Creates sample products if none exist
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Category = require('../src/models/Category');
const Subcategory = require('../src/models/Subcategory');
const Product = require('../src/models/Product');
const User = require('../src/models/User');

// ─── Seed Data Definition ───────────────────────────────────────────
// Each category has an array of subcategories.
// Products will be created under each subcategory.
const SEED_DATA = {
    'Electronics': {
        slug: 'electronics',
        subcategories: [
            { name: 'Mobile Phones', slug: 'mobile-phones' },
            { name: 'Laptops', slug: 'laptops' },
            { name: 'Audio', slug: 'audio' },
            { name: 'Cameras', slug: 'cameras' },
            { name: 'Gaming', slug: 'gaming' },
            { name: 'Wearables', slug: 'wearables' },
        ],
    },
    'Fashion': {
        slug: 'fashion',
        subcategories: [
            { name: 'Men\'s Clothing', slug: 'mens-clothing' },
            { name: 'Women\'s Clothing', slug: 'womens-clothing' },
            { name: 'Footwear', slug: 'footwear' },
            { name: 'Bags & Luggage', slug: 'bags-luggage' },
            { name: 'Kids Wear', slug: 'kids-wear' },
        ],
    },
    'Home & Furniture': {
        slug: 'home-furniture',
        subcategories: [
            { name: 'Bedroom Furniture', slug: 'bedroom-furniture' },
            { name: 'Living Room', slug: 'living-room' },
            { name: 'Kitchen & Dining', slug: 'kitchen-dining' },
            { name: 'Home Decor', slug: 'home-decor' },
            { name: 'Lighting', slug: 'lighting' },
        ],
    },
    'Beauty & Personal Care': {
        slug: 'beauty-personal-care',
        subcategories: [
            { name: 'Skincare', slug: 'skincare' },
            { name: 'Haircare', slug: 'haircare' },
            { name: 'Makeup', slug: 'makeup' },
            { name: 'Fragrances', slug: 'fragrances' },
        ],
    },
    'Sports & Fitness': {
        slug: 'sports-fitness',
        subcategories: [
            { name: 'Exercise Equipment', slug: 'exercise-equipment' },
            { name: 'Sports Shoes', slug: 'sports-shoes' },
            { name: 'Outdoor Gear', slug: 'outdoor-gear' },
            { name: 'Fitness Accessories', slug: 'fitness-accessories' },
        ],
    },
};

// Sample products for each subcategory
const SAMPLE_PRODUCTS = {
    'mobile-phones': [
        { title: 'iPhone 15 Pro Max', price: 134900, brand: 'Apple', description: 'Latest Apple flagship with A17 Pro chip, 48MP camera system, and titanium design.', stock: 25, productType: 'smartphone' },
        { title: 'Samsung Galaxy S24 Ultra', price: 129999, brand: 'Samsung', description: 'Samsung flagship with Snapdragon 8 Gen 3, S Pen, and 200MP camera.', stock: 30, productType: 'smartphone' },
        { title: 'OnePlus 12', price: 64999, brand: 'OnePlus', description: 'Premium performance with Snapdragon 8 Gen 3 and 50MP Hasselblad camera.', stock: 40, productType: 'smartphone' },
    ],
    'laptops': [
        { title: 'MacBook Air M3', price: 114900, brand: 'Apple', description: '13-inch MacBook Air with M3 chip, 18-hour battery life, and fanless design.', stock: 15, productType: 'laptop' },
        { title: 'Dell XPS 15', price: 159990, brand: 'Dell', description: 'Premium ultrabook with Intel Core i9, OLED display, and sleek design.', stock: 10, productType: 'laptop' },
        { title: 'ASUS ROG Strix G16', price: 134990, brand: 'ASUS', description: 'Gaming laptop with RTX 4070, Intel i9, and 240Hz display.', stock: 12, productType: 'gaming_laptop' },
    ],
    'audio': [
        { title: 'Sony WH-1000XM5', price: 29990, brand: 'Sony', description: 'Industry-leading noise cancellation with premium sound quality.', stock: 50, productType: 'bluetooth_headphones' },
        { title: 'Apple AirPods Pro 2', price: 24900, brand: 'Apple', description: 'Active noise cancellation, transparency mode, and adaptive audio.', stock: 45, productType: 'bluetooth_headphones' },
        { title: 'JBL Charge 5', price: 14999, brand: 'JBL', description: 'Portable Bluetooth speaker with powerful bass and 20-hour battery.', stock: 35, productType: 'bluetooth_speaker' },
    ],
    'cameras': [
        { title: 'Canon EOS R6 Mark II', price: 249990, brand: 'Canon', description: 'Full-frame mirrorless camera with 24.2MP sensor and 6K video.', stock: 8, productType: 'mirrorless_camera' },
        { title: 'Sony Alpha 7 IV', price: 198990, brand: 'Sony', description: 'Full-frame hybrid camera with 33MP sensor and 4K 60fps video.', stock: 10, productType: 'mirrorless_camera' },
    ],
    'gaming': [
        { title: 'PlayStation 5', price: 49990, brand: 'Sony', description: 'Next-gen gaming console with 4K gaming and lightning-fast SSD.', stock: 20, productType: 'gaming_console' },
        { title: 'Xbox Series X', price: 49990, brand: 'Microsoft', description: '12 teraflops of processing power for true 4K gaming.', stock: 18, productType: 'xbox_console' },
        { title: 'Logitech G Pro X Superlight', price: 12495, brand: 'Logitech', description: 'Ultra-lightweight wireless gaming mouse with HERO 25K sensor.', stock: 40, productType: 'gaming_mouse' },
    ],
    'wearables': [
        { title: 'Apple Watch Ultra 2', price: 89900, brand: 'Apple', description: 'Rugged smartwatch with precision GPS and 36-hour battery life.', stock: 15, productType: 'smart_watch' },
        { title: 'Samsung Galaxy Watch 6', price: 28999, brand: 'Samsung', description: 'Advanced health monitoring with sleek design and Wear OS.', stock: 25, productType: 'smart_watch' },
    ],
    'mens-clothing': [
        { title: 'Premium Cotton T-Shirt', price: 1299, brand: 'Peter England', description: 'Soft cotton crew-neck t-shirt in classic fit.', stock: 100, productType: 'mens_tshirt' },
        { title: 'Slim Fit Formal Shirt', price: 2499, brand: 'Van Heusen', description: 'Wrinkle-free formal shirt with button-down collar.', stock: 60, productType: 'mens_shirt' },
    ],
    'womens-clothing': [
        { title: 'Embroidered Anarkali Kurta', price: 2999, brand: 'Biba', description: 'Festive Anarkali kurta with intricate embroidery and flared silhouette.', stock: 40, productType: 'womens_kurta' },
        { title: 'Banarasi Silk Saree', price: 8999, brand: 'FabIndia', description: 'Handwoven Banarasi silk saree with traditional zari work.', stock: 20, productType: 'saree' },
    ],
    'footwear': [
        { title: 'Nike Air Max 270', price: 13995, brand: 'Nike', description: 'Iconic Air Max with 270-degree Air unit for all-day comfort.', stock: 35, productType: 'sneakers' },
        { title: 'Adidas Ultraboost 23', price: 16999, brand: 'Adidas', description: 'Premium running shoe with BOOST midsole technology.', stock: 28, productType: 'running_shoes' },
        { title: 'Clarks Oxford Shoes', price: 7999, brand: 'Clarks', description: 'Classic leather Oxford shoes for formal occasions.', stock: 22, productType: 'formal_shoes' },
    ],
    'bags-luggage': [
        { title: 'American Tourister Backpack', price: 2499, brand: 'American Tourister', description: 'Durable 30L laptop backpack with rain cover.', stock: 50, productType: 'backpack' },
        { title: 'Wildcraft Duffle Bag', price: 1999, brand: 'Wildcraft', description: 'Spacious travel duffle bag with multiple compartments.', stock: 30, productType: 'duffle_bag' },
    ],
    'kids-wear': [
        { title: 'Kids Cotton Pajama Set', price: 799, brand: 'Mothercare', description: 'Comfortable cotton pajama set with fun prints for kids.', stock: 80, productType: 'kids_clothing' },
    ],
    'bedroom-furniture': [
        { title: 'Sleepyhead Memory Foam Mattress', price: 14999, brand: 'Sleepyhead', description: 'Body-adapting memory foam mattress for optimal sleep.', stock: 10, productType: 'mattress' },
        { title: 'Jaipuri Cotton Bedsheet Set', price: 1499, brand: 'Bombay Dyeing', description: 'Premium cotton bedsheet set with 2 pillow covers.', stock: 40, productType: 'bedsheet' },
    ],
    'living-room': [
        { title: 'L-Shaped Sectional Sofa', price: 34999, brand: 'Urban Ladder', description: 'Premium fabric L-shaped sofa with 5-year warranty.', stock: 5, productType: 'sofa' },
    ],
    'kitchen-dining': [
        { title: 'Prestige Pressure Cooker 5L', price: 2399, brand: 'Prestige', description: 'Stainless steel pressure cooker with safety valve.', stock: 30, productType: 'pressure_cooker' },
    ],
    'home-decor': [
        { title: 'Decorative Table Lamp', price: 1999, brand: 'Philips', description: 'Modern table lamp with adjustable brightness.', stock: 25, productType: 'led_bulb' },
    ],
    'lighting': [
        { title: 'Philips LED Bulb Pack (4)', price: 599, brand: 'Philips', description: 'Energy-efficient LED bulbs with warm white light.', stock: 100, productType: 'led_bulb' },
    ],
    'skincare': [
        { title: 'Vitamin C Serum', price: 799, brand: 'Minimalist', description: 'Brightening vitamin C serum with hyaluronic acid.', stock: 60, productType: 'placeholder' },
    ],
    'haircare': [
        { title: 'Anti-Hair Fall Shampoo', price: 499, brand: 'L\'Oreal', description: 'Strengthening shampoo to reduce hair fall by up to 97%.', stock: 80, productType: 'placeholder' },
    ],
    'makeup': [
        { title: 'Matte Lipstick Set', price: 1299, brand: 'Maybelline', description: 'Long-lasting matte lipstick set with 6 shades.', stock: 50, productType: 'placeholder' },
    ],
    'fragrances': [
        { title: 'Eau de Parfum 100ml', price: 3499, brand: 'Engage', description: 'Long-lasting floral fragrance for everyday wear.', stock: 35, productType: 'placeholder' },
    ],
    'exercise-equipment': [
        { title: 'Adjustable Dumbbells Set', price: 4999, brand: 'Decathlon', description: 'Space-saving adjustable dumbbells from 2.5kg to 24kg.', stock: 15, productType: 'placeholder' },
    ],
    'sports-shoes': [
        { title: 'Running Shoes Pro', price: 5999, brand: 'Puma', description: 'Lightweight running shoes with cushioned midsole.', stock: 40, productType: 'running_shoes' },
    ],
    'outdoor-gear': [
        { title: 'Camping Tent (4 Person)', price: 6999, brand: 'Quechua', description: 'Waterproof pop-up tent for 4 people with UV protection.', stock: 12, productType: 'placeholder' },
    ],
    'fitness-accessories': [
        { title: 'Resistance Band Set', price: 899, brand: 'Boldfit', description: 'Set of 5 resistance bands for full-body workout.', stock: 70, productType: 'placeholder' },
    ],
};

async function seed() {
    try {
        console.log('\n🚀 Starting Category Seed...\n');
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find or create a vendor user for sample products
        let vendor = await User.findOne({ role: 'vendor' });
        if (!vendor) {
            vendor = await User.create({
                name: 'Seed Vendor',
                email: 'vendor@apex.com',
                password: 'vendor123',
                role: 'vendor',
                vendorDetails: { storeName: 'Apex Official Store', description: 'Official marketplace vendor' },
            });
            console.log('✅ Created vendor user:', vendor.email);
        }

        // Clear old category/subcategory data
        await Category.deleteMany({});
        await Subcategory.deleteMany({});
        console.log('🗑️  Cleared old Category & Subcategory documents\n');

        const categoryMap = {};     // name → ObjectId
        const subcategoryMap = {};  // slug → ObjectId

        // Create categories and subcategories
        for (const [catName, catData] of Object.entries(SEED_DATA)) {
            const category = await Category.create({
                name: catName,
                slug: catData.slug,
            });
            categoryMap[catName] = category._id;
            console.log(`📂 Category: ${catName} → ${category._id}`);

            for (const sub of catData.subcategories) {
                const subcategory = await Subcategory.create({
                    name: sub.name,
                    slug: sub.slug,
                    categoryId: category._id,
                });
                subcategoryMap[sub.slug] = {
                    _id: subcategory._id,
                    categoryId: category._id,
                    categoryName: catName,
                };
                console.log(`   └── Subcategory: ${sub.name} → ${subcategory._id} (categoryId: ${category._id})`);
            }
        }

        console.log('\n✅ Categories & Subcategories seeded\n');

        // Migrate existing products if they have string-based category/subCategory
        const existingProducts = await Product.find({ categoryId: { $exists: false } });
        if (existingProducts.length > 0) {
            console.log(`🔄 Migrating ${existingProducts.length} existing products...\n`);
            let migrated = 0;
            let skipped = 0;

            for (const prod of existingProducts) {
                // Try to find matching category
                const catId = categoryMap[prod.category];
                if (!catId) {
                    skipped++;
                    continue;
                }

                // Try to find matching subcategory within this category
                const matchingSub = await Subcategory.findOne({
                    categoryId: catId,
                    name: prod.subCategory,
                });

                if (matchingSub) {
                    prod.categoryId = catId;
                    prod.subcategoryId = matchingSub._id;
                    await prod.save();
                    migrated++;
                } else {
                    // Assign to first subcategory of the category as fallback
                    const fallbackSub = await Subcategory.findOne({ categoryId: catId });
                    if (fallbackSub) {
                        prod.categoryId = catId;
                        prod.subcategoryId = fallbackSub._id;
                        await prod.save();
                        migrated++;
                    } else {
                        skipped++;
                    }
                }
            }
            console.log(`   Migrated: ${migrated}, Skipped: ${skipped}\n`);
        }

        // Create sample products
        console.log('🛍️  Creating sample products...\n');
        let created = 0;
        for (const [subSlug, products] of Object.entries(SAMPLE_PRODUCTS)) {
            const subInfo = subcategoryMap[subSlug];
            if (!subInfo) {
                console.log(`   ⚠️  No subcategory found for slug: ${subSlug}, skipping`);
                continue;
            }

            for (const prod of products) {
                // Check if product with same title already exists
                const exists = await Product.findOne({ title: prod.title });
                if (exists) {
                    // Update existing product with correct references
                    exists.categoryId = subInfo.categoryId;
                    exists.subcategoryId = subInfo._id;
                    exists.category = subInfo.categoryName;
                    exists.subCategory = subSlug;
                    await exists.save();
                    continue;
                }

                await Product.create({
                    vendorId: vendor._id,
                    title: prod.title,
                    price: prod.price,
                    description: prod.description,
                    brand: prod.brand,
                    productType: prod.productType,
                    stock: prod.stock,
                    categoryId: subInfo.categoryId,
                    subcategoryId: subInfo._id,
                    category: subInfo.categoryName,
                    subCategory: subSlug,
                    images: [],
                });
                created++;
            }
        }
        console.log(`\n✅ Created ${created} sample products\n`);

        // Verification
        console.log('─── VERIFICATION ───────────────────────────────────────\n');
        const allCategories = await Category.find();
        for (const cat of allCategories) {
            const subs = await Subcategory.find({ categoryId: cat._id });
            const prodCount = await Product.countDocuments({ categoryId: cat._id });
            console.log(`📂 ${cat.name} (${cat._id})`);
            console.log(`   Subcategories: ${subs.length} | Products: ${prodCount}`);
            for (const sub of subs) {
                const subProdCount = await Product.countDocuments({ subcategoryId: sub._id });
                console.log(`   └── ${sub.name} (${sub._id}) → ${subProdCount} products`);
            }
            console.log('');
        }

        console.log('🎉 Seed complete!\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
}

seed();
