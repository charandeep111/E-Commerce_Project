const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const VENDOR_ID = new ObjectId('698f09c459d827c9ef50c7af');

const HIERARCHY = [
    {
        name: 'Electronics',
        slug: 'electronics',
        subcategories: [
            {
                name: 'Laptops',
                slug: 'laptops',
                brands: [
                    { name: 'Apple', products: ['MacBook Air M2 13-inch', 'MacBook Pro 14-inch M3'] },
                    { name: 'HP', products: ['HP Pavilion', 'HP Spectre x360'] },
                    { name: 'Dell', products: ['Dell XPS-15', 'Dell Inspiron 15'] },
                    { name: 'Asus', products: ['ASUS ZenBook 14 OLED', 'ASUS VivoBook 15'] }
                ]
            },
            {
                name: 'Wearables',
                slug: 'wearables',
                brands: [
                    { name: 'Apple', products: ['Apple Watch Series 9', 'Apple Watch Ultra 2'] },
                    { name: 'Samsung', products: ['Galaxy Watch 6', 'Galaxy Watch 6 Classic'] },
                    { name: 'Noise', products: ['Noise ColorFit Pro 5', 'Noise ColorFit Ultra 3'] },
                    { name: 'Boat', products: ['Boat Wave Call 2 Smartwatch', 'Boat Xtend Smartwatch'] }
                ]
            },
            {
                name: 'Consoles',
                slug: 'consoles',
                brands: [
                    { name: 'Sony', products: ['PlayStation 5'] },
                    { name: 'Microsoft', products: ['Xbox Series S'] }
                ]
            },
            {
                name: 'Data Storage',
                slug: 'data-storage',
                brands: [
                    { name: 'Samsung', products: ['Samsung T7 Portable SSD'] },
                    { name: 'WD', products: ['WD Black SN850X'] }
                ]
            }
        ]
    },
    {
        name: 'Appliances',
        slug: 'appliances',
        subcategories: [
            {
                name: 'Televisions',
                slug: 'televisions',
                brands: [
                    { name: 'Samsung', products: ['Samsung 55" Crystal 4K Smart TV'] },
                    { name: 'Sony', products: ['Sony Bravia XR 55" Smart TV'] }
                ]
            },
            {
                name: 'Air Conditioners',
                slug: 'air-conditioners',
                brands: [
                    { name: 'LG', products: ['LG Dual Inverter 1.5 Ton AC'] },
                    { name: 'Voltas', products: ['Voltas 1.5 Ton Split AC'] }
                ]
            },
            {
                name: 'Refrigerators',
                slug: 'refrigerators',
                brands: [
                    { name: 'Samsung', products: ['Samsung 253L Double Door Refrigerator'] },
                    { name: 'LG', products: ['LG 260L Frost Free Refrigerator'] }
                ]
            },
            {
                name: 'Inverters',
                slug: 'inverters',
                brands: [
                    { name: 'Luminous', products: ['Luminous Zelio+ 1100 Inverter'] },
                    { name: 'Microtek', products: ['Microtek UPS Inverter 900VA'] }
                ]
            }
        ]
    },
    {
        name: 'Sports',
        slug: 'sports',
        subcategories: [
            {
                name: 'Cricket',
                slug: 'cricket',
                brands: [
                    { name: 'Kookaburra', products: ['Kookaburra Cricket Ball'] },
                    { name: 'Gray-Nicolls', products: ['Gray-Nicolls Batting Gloves'] }
                ]
            },
            {
                name: 'Badminton',
                slug: 'badminton',
                brands: [
                    { name: 'Yonex', products: ['Yonex Nanoray 10F Racket'] },
                    { name: 'Li-Ning', products: ['Li-Ning Feather Shuttlecock'] }
                ]
            },
            {
                name: 'Cycling',
                slug: 'cycling',
                brands: [
                    { name: 'Hero', products: ['Hero Sprint 26T Mountain Bike'] },
                    { name: 'Firefox', products: ['Firefox Rapide Hybrid Cycle'] }
                ]
            },
            {
                name: 'Cardio Equipment',
                slug: 'cardio-equipment',
                brands: [
                    { name: 'PowerMax', products: ['PowerMax Treadmill TDA-230'] },
                    { name: 'Fitkit', products: ['Fitkit Rowing Machine'] }
                ]
            },
            {
                name: 'Football',
                slug: 'football',
                brands: [
                    { name: 'Nivia', products: ['Nivia Storm Football'] },
                    { name: 'Adidas', products: ['Adidas Training Football'] }
                ]
            }
        ]
    },
    {
        name: 'Home',
        slug: 'home',
        subcategories: [
            {
                name: 'Furniture',
                slug: 'furniture',
                brands: [
                    { name: 'Recliners', products: ['Wakefit Single Seater Recliner', 'Durian Leather Recliner Chair'] },
                    { name: 'Coffee Tables', products: ['IKEA Wooden Coffee Table', 'Urban Ladder Glass Coffee Table'] },
                    { name: 'Shoe Racks', products: ['Nilkamal 5 Tier Shoe Rack', 'IKEA TRONES Shoe Cabinet'] }
                ]
            },
            { name: 'Sofas', slug: 'sofas', brands: [] },
            {
                name: 'Bedsheets',
                slug: 'bedsheets',
                brands: [
                    { name: 'Bombay Dyeing', products: ['Bombay Dyeing Cotton Bedsheet Set'] },
                    { name: 'Raymond', products: ['Raymond Home Premium Bedsheet'] }
                ]
            },
            {
                name: 'Utilities',
                slug: 'utilities',
                brands: [
                    { name: 'Prestige', products: ['Prestige Pressure Cooker'] },
                    { name: 'Pigeon', products: ['Pigeon Non-Stick Cookware Set'] }
                ]
            },
            { name: 'Containers', slug: 'containers', brands: [] }
        ]
    }
];

async function seed() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB via Native Driver');
        const db = client.db();
        
        const categoriesColl = db.collection('categories');
        const subcategoriesColl = db.collection('subcategories');
        const productsColl = db.collection('products');

        console.log('Wiping existing data...');
        await Promise.all([
            categoriesColl.deleteMany({}),
            subcategoriesColl.deleteMany({}),
            productsColl.deleteMany({})
        ]);
        console.log('Data wiped.');

        for (const catData of HIERARCHY) {
            const catResult = await categoriesColl.insertOne({
                name: catData.name,
                slug: catData.slug,
                image: '',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const catId = catResult.insertedId;
            console.log(`+ Category: ${catData.name}`);

            for (const subData of catData.subcategories) {
                const subResult = await subcategoriesColl.insertOne({
                    name: subData.name,
                    slug: subData.slug,
                    categoryId: catId,
                    image: '',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                const subId = subResult.insertedId;
                console.log(`  + Subcategory: ${subData.name}`);

                for (const brandData of subData.brands) {
                    for (const title of brandData.products) {
                        await productsColl.insertOne({
                            title,
                            price: Math.floor(Math.random() * 2000) + 500,
                            description: `${title} is a premium product in the ${subData.name} category.`,
                            categoryId: catId,
                            subcategoryId: subId,
                            category: catData.name,
                            subCategory: subData.name,
                            brand: brandData.name,
                            vendorId: VENDOR_ID,
                            stock: 100,
                            images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', public_id: 'placeholder' }],
                            createdAt: new Date(),
                            updatedAt: new Date()
                        });
                        console.log(`    - Product: ${title}`);
                    }
                }
            }
        }

        console.log('\nSUCCESS: Database rebuilt successfully using native driver!');
        process.exit(0);
    } catch (err) {
        console.error('NATIVE_SEED_ERROR:', err);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seed();
