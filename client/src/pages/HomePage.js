import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiTrendingUp, FiShield, FiTruck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const HomePage = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const categories = [
        'Electronics',
        'Fashion',
        'Home & Furniture',
        'TV & Appliances',
        'Mobiles & Tablets'
    ];

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const cardWidth = current.firstElementChild?.clientWidth || current.clientWidth;
            const gap = 24;
            const scrollAmount = cardWidth + gap;

            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

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
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="space-y-20 pb-20 overflow-hidden">
            <Helmet>
                <title>Apex - Premium Multi-Vendor Marketplace</title>
                <meta name="description" content="Discover a curated collection of premium products from top vendors. Shop electronics, fashion, and home goods with confidence." />
            </Helmet>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="sm:text-center lg:text-left"
                            >
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Experience luxury in</span>{' '}
                                    <span className="block text-primary-600 xl:inline">every click</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Apex brings you a curated collection of premium products from top vendors. Explore a world where quality meets style and authenticity.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-md shadow"
                                    >
                                        <Link
                                            to="/products"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg transition-all"
                                        >
                                            Shop Collection
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mt-3 sm:mt-0 sm:ml-3"
                                    >
                                        <Link
                                            to="/register"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg transition-all"
                                        >
                                            Join Now
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </main>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center"
                >
                    <div className="text-9xl text-gray-200 font-bold opacity-30 select-none tracking-tighter">
                        APEX
                    </div>
                    {/* Floating elements for modern look */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary-200 rounded-full blur-xl"
                    />
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-blue-200 rounded-full blur-xl"
                    />
                </motion.div>
            </div>

            {/* Features Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div variants={itemVariants} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <FiShield className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payments</h3>
                        <p className="text-gray-500">Your transactions are protected with state-of-the-art security encryption.</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <FiTrendingUp className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Quality</h3>
                        <p className="text-gray-500">We verify every vendor to ensure you receive only the best authentic products.</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <FiTruck className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Pristine Delivery</h3>
                        <p className="text-gray-500">Optimized logistics network to get your premium goods to you in perfect condition.</p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Categories Preview */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Curated Categories</h2>
                        <p className="text-gray-500 mt-2">Explore our handpicked selection across multiple niches</p>
                    </div>
                    <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center group">
                        View all <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="relative group/scroll">
                    {categories.length > 3 && (
                        <>
                            <button
                                onClick={() => scroll('left')}
                                className="hidden md:flex absolute top-1/2 -left-4 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform hover:scale-110"
                                aria-label="Previous categories"
                            >
                                <FiChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform hover:scale-110"
                                aria-label="Next categories"
                            >
                                <FiChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((cat, index) => (
                            <motion.div
                                key={cat}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
                                className="min-w-full md:min-w-[calc((100%-3rem)/3)] snap-center group relative h-72 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 shadow-sm hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <h3 className="text-2xl font-bold text-white mb-2 transform group-hover:scale-110 transition-transform duration-500">{cat}</h3>
                                    <div className="w-10 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
                                    <p className="text-gray-400 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm italic">Discover Collection</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HomePage;
