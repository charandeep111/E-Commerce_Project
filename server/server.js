// server.js – entry point for Express API
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// Verify critical environment variables
if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not defined. Authentication will fail.');
}
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    console.warn('WARNING: MONGODB_URI/MONGO_URI is not defined. Database connection will fail.');
}

const corsOptions = {
    origin: process.env.CLIENT_URL || '*',
    credentials: process.env.CLIENT_URL ? true : false,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
connectDB();

// Simple health-check route
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// ─── Routes ─────────────────────────────────────────────────────────
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

const categoryRoutes = require('./src/routes/category');
app.use('/api/categories', categoryRoutes);

const subcategoryRoutes = require('./src/routes/subcategory');
app.use('/api/subcategories', subcategoryRoutes);

const productRoutes = require('./src/routes/product');
app.use('/api/products', productRoutes);

const cartRoutes = require('./src/routes/cart');
app.use('/api/cart', cartRoutes);

const orderRoutes = require('./src/routes/order');
app.use('/api/orders', orderRoutes);

const reviewRoutes = require('./src/routes/review');
app.use('/api/reviews', reviewRoutes);

const wishlistRoutes = require('./src/routes/wishlist');
app.use('/api/wishlist', wishlistRoutes);

const copilotRoutes = require('./src/routes/copilot');
app.use('/api/copilot', copilotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
