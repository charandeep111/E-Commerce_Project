import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSearchResults = useCallback(async () => {
        if (!query) return;
        try {
            setLoading(true);
            const { data } = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
            setProducts(data);
            setError('');
        } catch (err) {
            console.error('Search failed', err);
            setError('Failed to fetch search results. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>Search results for "{query}" - Apex</title>
            </Helmet>

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link to="/products" className="flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4 transition-colors">
                        <FiArrowLeft className="mr-2" /> Back to Products
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center">
                        <FiSearch className="mr-4 text-primary-600" />
                        {query ? (
                            <span>Results for "<span className="text-primary-600">{query}</span>"</span>
                        ) : (
                            <span>Search Products</span>
                        )}
                    </h1>
                    {products.length > 0 && !loading && (
                        <p className="text-gray-500 mt-2">Found {products.length} products matching your query.</p>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-gray-500 font-medium">Searching our catalog...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <button onClick={fetchSearchResults} className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors">
                        Try Again
                    </button>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <FiSearch size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No relevant products found.</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        Try different keywords or browse our categories.
                    </p>
                    <Link to="/products" className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20">
                        Browse All Products
                    </Link>
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    <AnimatePresence>
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default SearchPage;
