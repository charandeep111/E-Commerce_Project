import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiLayers, FiShield, FiSmartphone, FiArrowRight } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const categories = [
        { name: 'Electronics', description: 'Latest gadgets and tech', icon: <FiSmartphone className="w-8 h-8" /> },
        { name: 'Sports', description: 'Gear for your active lifestyle', icon: <FiLayers className="w-8 h-8" /> },
        { name: 'Watches', description: 'Timeless elegance for your wrist', icon: <FiShoppingBag className="w-8 h-8" /> },
        { name: 'Accessories', description: 'Complete your look', icon: <FiShield className="w-8 h-8" /> },
    ];

    const features = [
        { title: 'Secure Authentication', description: 'Protected login and signup using JWT.', icon: <FiShield /> },
        { title: 'Easy Browsing', description: 'Intuitive interface to find what you need.', icon: <FiShoppingBag /> },
        { title: 'Category Filters', description: 'Navigate products by niche easily.', icon: <FiLayers /> },
        { title: 'Responsive Design', description: 'Works perfectly on all devices.', icon: <FiSmartphone /> },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="bg-white">
            <Helmet>
                <title>Home | Apex Marketplace</title>
                <meta name="description" content="Welcome to Apex - Explore our multi-vendor e-commerce platform." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-6 font-display">
                            Welcome to <span className="text-primary-600">Apex</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                            Discover a new era of shopping. Our platform connects you with the finest products across multiple categories, ensuring a seamless and premium experience from start to finish.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link 
                                to="/products" 
                                className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all transform hover:-translate-y-1"
                            >
                                Start Exploring
                            </Link>
                            <Link 
                                to="/search" 
                                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Search Products
                            </Link>
                        </div>
                    </motion.div>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-100 rounded-full blur-3xl opacity-50 -ml-20 -mb-20"></div>
            </section>

            {/* About Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">What is Apex?</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Apex is a state-of-the-art multi-vendor marketplace designed for the modern shopper. We've simplified the journey from discovery to delivery.
                            </p>
                            <ul className="space-y-4">
                                {['Browse curated luxury categories', 'Secure transaction processing', 'Interactive vendor dashboards'].map((item, i) => (
                                    <li key={i} className="flex items-center text-gray-700">
                                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 bg-gray-100 rounded-3xl p-8 aspect-video flex items-center justify-center relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            <FiShoppingBag className="w-24 h-24 text-primary-200 group-hover:text-primary-300 transition-colors" />
                            <div className="absolute bottom-6 right-6 bg-white p-4 rounded-2xl shadow-lg transform translate-y-20 group-hover:translate-y-0 transition-transform">
                                <p className="text-sm font-bold text-gray-900">10k+ Products</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">Explore Our Categories</h2>
                        <p className="text-gray-600">Handpicked selections to suit every need.</p>
                    </div>
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {categories.map((cat, i) => (
                            <motion.div 
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl mb-6 transform rotate-3 group-hover:rotate-0 transition-transform">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                                <p className="text-gray-500 text-sm mb-6">{cat.description}</p>
                                <Link to={`/products?category=${cat.name}`} className="text-primary-600 font-semibold flex items-center justify-center gap-2 group">
                                    View <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                {features.map((f, i) => (
                                    <motion.div 
                                        key={i}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`p-6 rounded-2xl shadow-sm border border-gray-100 ${i % 2 === 1 ? 'mt-8' : ''} bg-white`}
                                    >
                                        <div className="text-2xl text-primary-600 mb-4">{f.icon}</div>
                                        <h4 className="font-bold text-gray-900 mb-1">{f.title}</h4>
                                        <p className="text-xs text-gray-500">{f.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:pl-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">Built for Performance & Security</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Our platform isn't just about shopping; it's about providing a robust environment where your data is safe and your experience is flawless.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="mt-1 p-2 bg-green-100 text-green-600 rounded-lg mr-4"><FiShield /></div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">JWT Authentication</h5>
                                        <p className="text-sm text-gray-500">Industry standard security for all user sessions.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="mt-1 p-2 bg-blue-100 text-blue-600 rounded-lg mr-4"><FiSmartphone /></div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">Mobile First</h5>
                                        <p className="text-sm text-gray-500">Shop on the go with our fully optimized mobile layout.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer-like section inside page */}
            <section className="py-20 bg-dark-bg text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 font-display">Ready to find your next favorite item?</h2>
                        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                            Join thousands of happy shoppers and start exploring our curated collections today.
                        </p>
                        <Link 
                            to="/products" 
                            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all group"
                        >
                            Explore All Products <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                    <div className="mt-20 pt-8 border-t border-gray-800 text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} Apex Marketplace. All rights reserved.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
