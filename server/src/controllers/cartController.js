// src/controllers/cartController.js – Cart CRUD (protected, customer only)
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get current customer's cart (or empty)
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerId: req.user.id }).populate('items.product');
        if (!cart) return res.json({ items: [] });
        res.json(cart);
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

        let cart = await Cart.findOne({ customerId: req.user.id });
        if (!cart) {
            cart = new Cart({ customerId: req.user.id, items: [] });
        }
        const existingItem = cart.items.find((i) => i.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += Number(quantity);
        } else {
            cart.items.push({ product: productId, quantity: Number(quantity) });
        }
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update quantity of a cart item
exports.updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ customerId: req.user.id });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });
        const item = cart.items.find((i) => i.product.toString() === productId);
        if (!item) return res.status(404).json({ msg: 'Item not in cart' });
        item.quantity = Number(quantity);
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Remove a product from cart
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;
    try {
        const cart = await Cart.findOne({ customerId: req.user.id });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });
        cart.items = cart.items.filter((i) => i.product.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ customerId: req.user.id });
        res.json({ msg: 'Cart cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
