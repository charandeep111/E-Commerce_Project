// server.js – entry point for Express API
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
