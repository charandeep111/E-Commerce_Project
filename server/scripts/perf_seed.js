const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seed() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI not found in .env');

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log('Cleared existing data');

        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Create 100 Vendors
        console.log('Seeding 100 Vendors...');
        const vendors = [];
        for (let i = 0; i < 100; i++) {
            vendors.push({
                name: faker.person.fullName(),
                email: `vendor${i}@example.com`,
                password: hashedPassword,
                role: 'vendor',
                vendorDetails: {
                    storeName: faker.company.name(),
                    description: faker.company.catchPhrase()
                }
            });
        }
        const createdVendors = await User.insertMany(vendors);
        const vendorIds = createdVendors.map(v => v._id);

        // 2. Create 1,000 Users (Customers)
        console.log('Seeding 1,000 Users...');
        const customers = [];
        for (let i = 0; i < 1000; i++) {
            customers.push({
                name: faker.person.fullName(),
                email: `user${i}@example.com`,
                password: hashedPassword,
                role: 'customer'
            });
        }
        const createdCustomers = await User.insertMany(customers);
        const customerIds = createdCustomers.map(c => c._id);

        // 3. Create 5,000 Products
        console.log('Seeding 5,000 Products...');
        const products = [];
        const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];
        for (let i = 0; i < 5000; i++) {
            products.push({
                vendorId: faker.helpers.arrayElement(vendorIds),
                title: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
                description: faker.commerce.productDescription(),
                category: faker.helpers.arrayElement(categories),
                subCategory: faker.commerce.department(),
                brand: faker.company.name(),
                stock: faker.number.int({ min: 0, max: 100 }),
                images: [{ url: faker.image.url(), public_id: faker.string.alphanumeric(10) }]
            });
        }
        const createdProducts = await Product.insertMany(products);
        const productIds = createdProducts.map(p => p._id);

        // 4. Create 2,000 Orders
        console.log('Seeding 2,000 Orders...');
        const orders = [];
        for (let i = 0; i < 2000; i++) {
            const itemCount = faker.number.int({ min: 1, max: 5 });
            const orderItems = [];
            let totalAmount = 0;
            // Pick a product to get a vendorId (Order model has vendorId at top level, likely per order)
            const baseProduct = faker.helpers.arrayElement(createdProducts);
            const vId = baseProduct.vendorId;

            for (let j = 0; j < itemCount; j++) {
                const product = faker.helpers.arrayElement(createdProducts);
                const quantity = faker.number.int({ min: 1, max: 3 });
                orderItems.push({
                    product: product._id,
                    quantity: quantity,
                    price: product.price
                });
                totalAmount += product.price * quantity;
            }

            orders.push({
                customerId: faker.helpers.arrayElement(customerIds),
                vendorId: vId,
                items: orderItems,
                totalAmount: totalAmount,
                status: faker.helpers.arrayElement(['pending', 'delivered', 'shipped', 'cancelled'])
            });
        }
        await Order.insertMany(orders);

        console.log('Seeding complete!');

        // Confirm DB size
        const stats = await mongoose.connection.db.stats();
        console.log(`DB Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Total Objects: ${stats.objects}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
