import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiLoader, FiCheckCircle } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from './ProductCard';
import { formatPrice } from '../utils/formatPrice';

const ShoppingCopilot = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.post('/copilot/recommend', { query });
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
                            Tell us your goal and budget, and our intelligent assistant will build the perfect bundle for you.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-12">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="eg. 'Build a home gym under $500', 'Best smartwatch under $300'"
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
                                className="mt-12 bg-white rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <div className="bg-gray-50 p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                            <FiCheckCircle className="text-green-500" /> Bundle Ready
                                        </h3>
                                        <p className="text-gray-500 mt-1">
                                            Based on your goal: <span className="italic text-gray-700 font-medium">"{result.goal}"</span>
                                        </p>
                                    </div>
                                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Items</p>
                                            <p className="text-xl font-bold text-gray-900">{result.products.length}</p>
                                        </div>
                                        <div className="w-px h-10 bg-gray-200"></div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Bundle Total</p>
                                            <p className="text-2xl font-display font-black text-indigo-600">{formatPrice(result.totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    {result.products.length > 0 ? (
                                        <>
                                            {result.message && (
                                                <p className="text-orange-600 bg-orange-50 p-4 rounded-xl mb-6 text-sm font-medium border border-orange-200">
                                                    {result.message}
                                                </p>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {result.products.map((product) => (
                                                    <div key={product._id} className="scale-95 transform-gpu shadow-xl rounded-2xl overflow-hidden">
                                                        <ProductCard product={product} />
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500 text-lg mb-4">{result.message}</p>
                                            <p className="text-gray-400">Try adjusting your budget or using broader terms.</p>
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
