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

// Simple health‑check route
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes); // auth routes

const productRoutes = require('./src/routes/product');
app.use('/api/products', productRoutes); // product CRUD routes

const cartRoutes = require('./src/routes/cart');
app.use('/api/cart', cartRoutes); // cart routes

const orderRoutes = require('./src/routes/order');
app.use('/api/orders', orderRoutes); // order routes

const reviewRoutes = require('./src/routes/review');
app.use('/api/reviews', reviewRoutes); // review routes

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
