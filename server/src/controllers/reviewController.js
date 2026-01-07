// src/controllers/reviewController.js
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc   Add a review
// @route  POST /api/reviews
// @access Protected (customer)
exports.addReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    try {
        // Optional: Verify if user actually bought the product
        // const hasPurchased = await Order.findOne({ 
        //     customerId: req.user.id, 
        //     'items.product': productId,
        //     status: 'delivered' 
        // });
        // if (!hasPurchased) return res.status(400).json({ msg: 'You can only review products you have purchased and received.' });

        // For now, allow any logged in customer to review (simpler for demo)

        const review = new Review({
            productId,
            customerId: req.user.id,
            rating,
            comment
        });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'You have already reviewed this product' });
        }
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc   Get reviews for a product
// @route  GET /api/reviews/:productId
// @access Public
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('customerId', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
