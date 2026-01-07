const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const { getImagesForProductType } = require('../src/config/imageRegistry');

dotenv.config({ path: path.join(__dirname, '../.env') });

const categoryToProductType = {
    'Watches': 'smart_watch',
    'Mobiles': 'smartphone',
    'Laptops': 'laptop',
    'Headphones': 'bluetooth_headphones',
    'Shoes': 'running_shoes',
    'Bags': 'backpack'
};

const inferProductType = (product) => {
    if (product.productType) {
        return product.productType;
    }

    const name = (product.name || '').toLowerCase();
    const category = product.category || '';
    const description = (product.description || '').toLowerCase();

    if (name.includes('gamepad') || name.includes('controller') || name.includes('joystick')) {
        return 'gamepad';
    }
    if (name.includes('gaming mouse') || (name.includes('mouse') && name.includes('gaming'))) {
        return 'gaming_mouse';
    }
    if (name.includes('gaming keyboard') || (name.includes('keyboard') && name.includes('gaming'))) {
        return 'gaming_keyboard';
    }
    if (name.includes('wireless headphone') || name.includes('bluetooth headphone') || description.includes('wireless')) {
        if (category === 'Headphones' || name.includes('headphone')) {
            return 'bluetooth_headphones';
        }
    }
    if (name.includes('wired headphone') || name.includes('over ear')) {
        return 'wired_earphones'; // Merged
    }
    if (name.includes('earphone') || name.includes('in-ear') || name.includes('earbud')) {
        return 'wired_earphones';
    }
    if (name.includes('speaker') && (name.includes('bluetooth') || name.includes('wireless'))) {
        return 'bluetooth_speaker';
    }
    if (name.includes('soundbar')) {
        return 'soundbar';
    }
    if (name.includes('home theater') || name.includes('home cinema') || name.includes('5.1')) {
        return 'home_theater';
    }
    if (name.includes('dslr') || (name.includes('camera') && (name.includes('eos') || name.includes('nikon d')))) {
        return 'dslr_camera';
    }
    if (name.includes('mirrorless')) {
        return 'mirrorless_camera';
    }
    if (name.includes('tripod')) {
        return 'camera_tripod';
    }
    if (name.includes('drone') || name.includes('mavic')) {
        return 'drone';
    }
    if (name.includes('gimbal') || name.includes('osmo')) {
        return 'gimbal';
    }
    if (name.includes('gopro') || name.includes('action camera')) {
        return 'action_camera';
    }
    if (name.includes('playstation') || name.includes('ps5') || name.includes('ps4')) {
        return 'gaming_console';
    }
    if (name.includes('xbox')) {
        return 'xbox_console';
    }
    if (name.includes('fifa') || name.includes('game') && !name.includes('gamepad')) {
        if (category === 'Electronics' || name.includes('edition')) {
            return 'video_game';
        }
    }
    if (name.includes('gaming laptop') || name.includes('nitro') || name.includes('rog')) {
        return 'gaming_laptop';
    }
    if (name.includes('macbook') || name.includes('laptop') || category === 'Laptops') {
        return 'laptop';
    }
    if (name.includes('all-in-one') || name.includes('all in one')) {
        return 'all_in_one_pc';
    }
    if (name.includes('mac mini') || name.includes('mini pc')) {
        return 'mini_pc';
    }
    if (name.includes('desktop') || name.includes('tower pc')) {
        return 'desktop_pc';
    }
    if (name.includes('apple watch') || name.includes('smartwatch') || name.includes('smart watch')) {
        return 'smart_watch';
    }
    if (name.includes('band') || name.includes('mi band')) {
        return 'smart_band';
    }
    if (name.includes('fitbit') || name.includes('fitness')) {
        return 'fitness_tracker';
    }
    if (name.includes('smart glasses') || name.includes('meta') || name.includes('ray-ban')) {
        return 'smart_glasses';
    }
    if (name.includes('ring') && name.includes('smart')) {
        return 'smart_ring';
    }
    if (name.includes('iphone') || name.includes('galaxy') || name.includes('pixel') || name.includes('redmi') || category === 'Mobiles') {
        return 'smartphone';
    }
    if (name.includes('ipad') || name.includes('tab') || name.includes('pad')) {
        return 'tablet';
    }
    if (name.includes('tv') || name.includes('television') || name.includes('bravia')) {
        return 'smart_tv';
    }
    if (name.includes('t-shirt') || name.includes('tee') || name.includes('tshirt')) {
        return 'mens_tshirt';
    }
    if (name.includes('shirt') && name.includes('formal')) {
        return 'mens_shirt';
    }
    if (name.includes('kurta')) {
        return 'womens_kurta';
    }
    if (name.includes('saree') || name.includes('sari')) {
        return 'saree';
    }
    if (name.includes('running') || name.includes('sports shoe') || name.includes('pegasus')) {
        return 'running_shoes';
    }
    if (name.includes('formal shoe') || name.includes('derby') || name.includes('oxford')) {
        return 'formal_shoes';
    }
    if (name.includes('heel') || name.includes('stiletto')) {
        return 'heels';
    }
    if (name.includes('sneaker') || name.includes('trainer') || category === 'Shoes') {
        return 'sneakers';
    }
    if (name.includes('kids') || name.includes('boy') || name.includes('girl')) {
        return 'kids_clothing';
    }
    if (name.includes('bedsheet') || name.includes('bed sheet')) {
        return 'bedsheet';
    }
    if (name.includes('mattress')) {
        return 'mattress';
    }
    if (name.includes('sofa') || name.includes('couch')) {
        return 'sofa';
    }
    if (name.includes('cooker') || name.includes('pressure')) {
        return 'pressure_cooker';
    }
    if (name.includes('bulb') || name.includes('led')) {
        return 'led_bulb';
    }
    if (name.includes('duffle') || name.includes('duffel')) {
        return 'duffle_bag';
    }
    if (name.includes('tote') || name.includes('leather bag')) {
        return 'tote_bag';
    }
    if (name.includes('hiking') || name.includes('rucksack') || name.includes('trek')) {
        return 'hiking_bag';
    }
    if (name.includes('backpack') || name.includes('travel bag') || category === 'Bags') {
        return 'backpack';
    }

    if (categoryToProductType[category]) {
        return categoryToProductType[category];
    }

    return 'placeholder';
};

const connectDB = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected for seeding');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const seedProducts = async () => {
    await connectDB();

    try {
        let vendor = await User.findOne({ role: 'vendor' });
        if (!vendor) {
            console.log('No vendor found. Creating a demo vendor user...');
            const email = 'vendor@demo.com';
            const existing = await User.findOne({ email });
            if (existing) {
                vendor = existing;
                if (vendor.role !== 'vendor') {
                    vendor.role = 'vendor';
                    await vendor.save();
                }
            } else {
                vendor = new User({
                    name: 'Demo Vendor',
                    email: email,
                    password: 'password123',
                    role: 'vendor',
                    vendorDetails: {
                        storeName: 'Demo Store',
                        description: 'A store with varied products.'
                    }
                });
                await vendor.save();
            }
        }
        console.log(`Using vendor: ${vendor.name} (${vendor._id})`);

        const dataPath = path.join(__dirname, '../products.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const parsedData = JSON.parse(rawData);

        const electronicsPath = path.join(__dirname, '../electronics_products.json');
        let electronicsData = [];
        try {
            if (fs.existsSync(electronicsPath)) {
                const rawElec = fs.readFileSync(electronicsPath, 'utf-8');
                electronicsData = JSON.parse(rawElec);
                console.log(`Loaded ${electronicsData.length} electronics products.`);
            }
        } catch (e) {
            console.log('Error loading electronics data:', e.message);
        }

        const otherPath = path.join(__dirname, '../other_products.json');
        let otherData = [];
        try {
            if (fs.existsSync(otherPath)) {
                const rawOther = fs.readFileSync(otherPath, 'utf-8');
                otherData = JSON.parse(rawOther);
                console.log(`Loaded ${otherData.length} other category products.`);
            }
        } catch (e) {
            console.log('Error loading other data:', e.message);
        }

        let allProducts = [];
        if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].batchIndex !== undefined) {
            parsedData.forEach(batch => {
                allProducts = allProducts.concat(batch.products);
            });
        } else {
            allProducts = parsedData;
        }

        allProducts = allProducts.concat(electronicsData);
        allProducts = allProducts.concat(otherData);

        console.log(`Found ${allProducts.length} total products to seed.`);

        await Product.deleteMany({});
        console.log('Cleared existing products.');

        const productTypeStats = {};
        const missingProductTypes = [];

        const productsToInsert = allProducts.map(p => {
            let productType = inferProductType(p);
            // Handle merge
            if (productType === 'wired_headphones') productType = 'wired_earphones';

            const brand = p.brand || (p.metadata && p.metadata.brand) || 'Generic';
            const imageUrls = getImagesForProductType(productType, brand);

            productTypeStats[productType] = (productTypeStats[productType] || 0) + 1;

            if (productType === 'placeholder') {
                missingProductTypes.push(p.name);
            }

            return {
                vendorId: vendor._id,
                title: p.name,
                price: p.price,
                discountPrice: p.discountPrice,
                description: p.description,
                category: p.category,
                subCategory: p.subCategory === 'Wired Headphones' ? 'Wired Earphones' : p.subCategory, // Normalize subCategory string too
                brand: brand,
                productType: productType,
                stock: p.stock,
                images: [], // Images are resolved dynamically from registry via productType
                createdAt: p.createdAt,
                updatedAt: p.updatedAt
            };
        });

        console.log('\nProduct type distribution:');
        Object.keys(productTypeStats).sort().forEach(type => {
            console.log(`  ${type}: ${productTypeStats[type]}`);
        });

        if (missingProductTypes.length > 0) {
            console.log(`\nWarning: ${missingProductTypes.length} products using placeholder images:`);
            missingProductTypes.slice(0, 10).forEach(name => console.log(`  - ${name}`));
            if (missingProductTypes.length > 10) {
                console.log(`  ... and ${missingProductTypes.length - 10} more`);
            }
        }

        await Product.insertMany(productsToInsert);
        console.log('\nProducts seeded successfully with centralized image registry!');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedProducts();
