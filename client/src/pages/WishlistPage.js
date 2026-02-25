import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const { wishlist, loading } = useWishlist();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>My Wishlist - Apex Marketplace</title>
            </Helmet>

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                    <FiHeart className="h-8 w-8 fill-current" />
                </div>
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900">My Wishlist</h1>
                    <p className="text-gray-500">You have {wishlist.length} items saved for later</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            ) : wishlist.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <FiHeart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-6">Save items you like to find them easily later.</p>
                    <Link to="/products" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {wishlist.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default WishlistPage;
