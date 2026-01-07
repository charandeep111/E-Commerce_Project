// src/controllers/orderController.js – Order handling (checkout, vendor view, admin view)
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to calculate total and build order items from cart
const buildOrderFromCart = async (cart, customerId) => {
    const items = [];
    let total = 0;
    for (const ci of cart.items) {
        const product = await Product.findById(ci.product);
        if (!product) continue; // skip missing product
        const price = product.price;
        const quantity = ci.quantity;
        items.push({ product: product._id, quantity, price });
        total += price * quantity;
    }
    // Assume all items belong to the same vendor for simplicity; pick first product's vendor
    const vendorId = items.length ? items[0].product.vendorId : null;
    return { items, total, vendorId };
};

// @desc   Checkout – create order(s) from customer's cart
// @route  POST /api/orders/checkout
// @access Protected (customer)
exports.checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerId: req.user.id });
        if (!cart || !cart.items.length) return res.status(400).json({ msg: 'Cart is empty' });

        // Group items by vendor
        const ordersPayload = {}; // vendorId -> { items: [], total: 0 }

        for (const ci of cart.items) {
            const product = await Product.findById(ci.product);
            if (!product) continue; // skip missing product

            const vendorId = product.vendorId.toString();
            if (!ordersPayload[vendorId]) {
                ordersPayload[vendorId] = { items: [], total: 0, vendorId: product.vendorId };
            }

            const quantity = ci.quantity;
            const price = product.price; // snapshot price

            ordersPayload[vendorId].items.push({
                product: product._id,
                quantity,
                price
            });
            ordersPayload[vendorId].total += price * quantity;
        }

        const createdOrders = [];
        for (const vid in ordersPayload) {
            const payload = ordersPayload[vid];
            if (payload.items.length === 0) continue;

            const order = new Order({
                customerId: req.user.id,
                vendorId: payload.vendorId,
                items: payload.items,
                totalAmount: payload.total,
            });
            await order.save();
            createdOrders.push(order);
        }

        if (createdOrders.length === 0) {
            return res.status(400).json({ msg: 'No valid products to order' });
        }

        // Clear cart after successful order
        await Cart.findOneAndDelete({ customerId: req.user.id });

        res.status(201).json({ msg: 'Orders placed successfully', orders: createdOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc   Get logged in customer's orders
// @route  GET /api/orders/myorders
// @access Protected (customer)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.id })
            .populate('items.product', 'title price images')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc   Vendor view own orders
// @route  GET /api/orders/vendor
// @access Protected (vendor)
exports.getVendorOrders = async (req, res) => {
    try {
        const orders = await Order.find({ vendorId: req.user.id })
            .populate('customerId', 'name email')
            .populate('items.product', 'title price');
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc   Admin view all orders
// @route  GET /api/orders/admin
// @access Protected (admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId', 'name email')
            .populate('vendorId', 'name email')
            .populate('items.product', 'title price');
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
