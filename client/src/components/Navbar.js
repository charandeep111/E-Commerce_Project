import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-display font-black tracking-tighter text-gray-900 hover:text-primary-600 transition-colors">
                                Apex Marketplace
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products, brands..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        navigate(`/products?search=${encodeURIComponent(e.target.value)}`);
                                    }
                                }}
                                className="w-full bg-gray-100 border-none rounded-full py-2 px-6 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/products" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                            Explore
                        </Link>

                        <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
                            <FiShoppingCart className="h-6 w-6" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 focus:outline-none">
                                    <FiUser className="h-6 w-6" />
                                    <span className="font-medium">{user.name}</span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                    <div className="py-1">
                                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                                            Profile
                                        </Link>
                                        <Link to="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                                            My Wishlist
                                        </Link>
                                        {user && user.role === 'admin' && (
                                            <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                                                Admin Panel
                                            </Link>
                                        )}
                                        {user && user.role === 'vendor' && (
                                            <Link to="/vendor-dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                                                Vendor Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 flex items-center space-x-2"
                                        >
                                            <FiLogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/register" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/20 uppercase tracking-widest text-xs">
                                        Join Now
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary-600 focus:outline-none">
                            {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                            Home
                        </Link>
                        <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                            Products
                        </Link>
                        {user ? (
                            <>
                                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                                    Profile
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                                    Login
                                </Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-50 uppercase tracking-widest">
                                    Join Apex
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
