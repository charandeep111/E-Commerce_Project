import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/formatPrice';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product._id);

    const toggleWishlist = (e) => {
        e.preventDefault();
        if (isWishlisted) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    const imageUrl = product.images && product.images.length > 0
        ? product.images[0].url
        : 'https://placehold.co/400x400?text=No+Image';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
        >
            <div className="block relative aspect-w-1 aspect-h-1 overflow-hidden bg-gray-200">
                <Link to={`/products/${product._id}`}>
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-60 object-cover object-center"
                    />
                </Link>
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleWishlist}
                        className={`p-2 rounded-full shadow-md transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
                            }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <FiHeart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </motion.button>
                </div>
                {product.stock <= 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <p className="text-sm text-primary-600 font-medium mb-1">{product.category}</p>
                    <Link to={`/products/${product._id}`}>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {product.title}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                        {product.vendorId && (
                            <p className="text-xs text-gray-500">By {product.vendorId.name}</p>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(product)}
                        className="p-3 rounded-full bg-gray-50 text-gray-600 hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        disabled={product.stock <= 0}
                        title="Add to Cart"
                    >
                        <FiShoppingCart className="h-5 w-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
