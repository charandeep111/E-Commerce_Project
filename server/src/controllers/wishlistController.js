const User = require('../models/User');
const { resolveProductImagesFromDoc } = require('../config/imageRegistry');

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);

        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ msg: 'Product already in wishlist' });
        }

        user.wishlist.push(productId);
        await user.save();
        res.json({ msg: 'Added to wishlist', wishlist: user.wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.id);

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        res.json({ msg: 'Removed from wishlist', wishlist: user.wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'wishlist',
            populate: { path: 'vendorId', select: 'name' }
        });

        const wishlistProducts = user.wishlist.map(resolveProductImagesFromDoc);
        res.json(wishlistProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
