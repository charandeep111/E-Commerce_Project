const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc   Create an order from user's cart
// @route  POST /api/orders/create
// @access Protected
exports.createOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.cart.length) return res.status(400).json({ msg: 'Cart is empty' });

        let totalPrice = 0;
        const productsInfo = [];

        // Build product list and total price
        for (const item of user.cart) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            const quantity = item.quantity;
            const price = product.price;

            productsInfo.push({
                product: product._id,
                quantity,
                price
            });
            totalPrice += price * quantity;
        }

        if (productsInfo.length === 0) {
            return res.status(400).json({ msg: 'No valid products to order' });
        }

        const vendorId = productsInfo[0].vendorId || null; // simplification if needed

        const order = new Order({
            userId: req.user.id,
            vendorId: vendorId,
            products: productsInfo,
            totalPrice: totalPrice,
        });

        await order.save();

        // Clear user's cart
        user.cart = [];
        await user.save();

        res.status(201).json({ msg: 'Order placed successfully', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc   Get logged in customer's orders
// @route  GET /api/orders/user
// @access Protected (customer)
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate('products.product', 'title price images')
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
            .populate('userId', 'name email')
            .populate('products.product', 'title price');
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
            .populate('userId', 'name email')
            .populate('vendorId', 'name email')
            .populate('products.product', 'title price');
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
