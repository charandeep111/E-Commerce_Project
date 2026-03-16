import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiLoader, FiCheckCircle, FiAlertCircle, FiTag, FiDollarSign } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from './ProductCard';
import { formatPrice } from '../utils/formatPrice';

// Example queries to help users understand what's possible
const EXAMPLE_QUERIES = [
    'A football below ₹2000',
    'Laptop under ₹50000',
    'Smartwatch below ₹3000',
    'Cricket bat under ₹2000',
    'Build a home gym under ₹15000',
    'Wireless earbuds below ₹1500',
];

const ShoppingCopilot = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        runQuery(query);
    };

    const runQuery = async (q) => {
        setLoading(true);
        setError('');
        setResult(null);
        setQuery(q);

        try {
            const { data } = await api.post('/copilot/recommend', { query: q });
            setResult(data);
        } catch (err) {
            setError('Could not process your request at the moment. Please try again later.');
            console.error('Copilot request failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">
                            Shopping Copilot
                        </h2>
                        <p className="text-lg text-indigo-200">
                            Describe what you're looking for in plain English — including a price limit — and we'll find the best matches.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-6">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g. 'A football below ₹2000' or 'Laptop under ₹50000'"
                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-indigo-300 rounded-2xl py-5 pl-6 pr-20 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-inner"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="absolute right-3 bg-indigo-500 hover:bg-indigo-400 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <FiLoader className="w-6 h-6 animate-spin" />
                                ) : (
                                    <FiSend className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Example queries */}
                    {!result && !loading && (
                        <div className="max-w-3xl mx-auto mb-8">
                            <p className="text-indigo-300 text-sm text-center mb-3">Try one of these:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {EXAMPLE_QUERIES.map((eq) => (
                                    <button
                                        key={eq}
                                        onClick={() => runQuery(eq)}
                                        className="text-sm bg-white/10 hover:bg-white/20 text-indigo-100 border border-white/20 px-4 py-2 rounded-full transition-all"
                                    >
                                        {eq}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-300 bg-red-900/40 py-3 px-6 rounded-xl max-w-2xl mx-auto backdrop-blur-sm border border-red-500/30">
                            <p>{error}</p>
                        </div>
                    )}

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="mt-8 bg-white rounded-3xl overflow-hidden shadow-2xl"
                            >
                                {/* Header */}
                                <div className="bg-gray-50 p-6 border-b border-gray-100">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                                                &ldquo;{result.goal}&rdquo;
                                            </h3>
                                            {/* What the parser understood */}
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {result.keywords && result.keywords.length > 0 && (
                                                    <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                                                        <FiTag className="w-3 h-3" />
                                                        Keyword: {result.keywords.join(', ')}
                                                    </span>
                                                )}
                                                {result.maxPrice != null && (
                                                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                                                        <FiDollarSign className="w-3 h-3" />
                                                        Price limit: {formatPrice(result.maxPrice)}
                                                    </span>
                                                )}
                                                {result.maxPrice == null && (
                                                    <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
                                                        No price limit detected
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {result.products.length > 0 && (
                                            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 flex-shrink-0">
                                                <div className="text-center">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Results</p>
                                                    <p className="text-xl font-bold text-gray-900">{result.products.length}</p>
                                                </div>
                                                <div className="w-px h-8 bg-gray-200"></div>
                                                <div className="text-center">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price Range</p>
                                                    <p className="text-lg font-display font-black text-indigo-600">
                                                        {formatPrice(Math.min(...result.products.map(p => p.price)))}
                                                        {result.products.length > 1 && (
                                                            <span className="text-sm text-gray-400 font-normal"> – {formatPrice(Math.max(...result.products.map(p => p.price)))}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 md:p-8">
                                    {result.products.length > 0 ? (
                                        <>
                                            {result.message && (
                                                <div className="flex items-start gap-3 text-orange-700 bg-orange-50 p-4 rounded-xl mb-6 text-sm font-medium border border-orange-200">
                                                    <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                    <p>{result.message}</p>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {result.products.map((product) => (
                                                    <div key={product._id} className="shadow-xl rounded-2xl overflow-hidden">
                                                        <ProductCard product={product} />
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FiAlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 text-lg mb-2">{result.message}</p>
                                            <p className="text-gray-400 text-sm">Try using different keywords or a higher price limit.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCopilot;
