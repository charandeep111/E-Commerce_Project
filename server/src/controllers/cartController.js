// src/controllers/cartController.js – Cart logic using User model
const User = require('../models/User');
const Product = require('../models/Product');

// Get current user's cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.productId');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Add a product to cart (or increase quantity)
exports.addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const existingItem = user.cart.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += Number(quantity);
        } else {
            user.cart.push({ productId, quantity: Number(quantity) });
        }

        await user.save();
        // Populate and return the full cart
        const updatedUser = await User.findById(user._id).populate('cart.productId');
        res.json(updatedUser.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Remove a product from cart (following prompt: POST /api/cart/remove)
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body; // Prompt suggests POST, so body is likely
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.cart = user.cart.filter((item) => item.productId.toString() !== productId);
        
        await user.save();
        const updatedUser = await User.findById(user._id).populate('cart.productId');
        res.json(updatedUser.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update quantity (optional but useful)
exports.updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const item = user.cart.find((i) => i.productId.toString() === productId);
        if (!item) return res.status(404).json({ msg: 'Item not in cart' });
        
        item.quantity = Number(quantity);
        await user.save();
        
        const updatedUser = await User.findById(user._id).populate('cart.productId');
        res.json(updatedUser.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = [];
        await user.save();
        res.json([]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
