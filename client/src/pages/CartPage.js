import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useState } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CartPage = () => {
    const { cart, loading, updateCartItem, removeFromCart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            clearCart();
            setIsCheckingOut(false);
            navigate('/products');
            toast.success("Order placed successfully! (Demo Only)");
        }, 1500);
    };

    if (loading && (!cart || !cart.items)) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
            >
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-8 text-8xl"
                >
                    🛒
                </motion.div>
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Your Apex Bag is Empty</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg">
                    Discover luxury essentials curated just for you. Your next favorite piece is waiting.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/products" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/30">
                        Explore Collection
                    </Link>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 italic">Your Selection</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items List */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {cart.items.map((item) => (
                                    <motion.li
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="p-8 flex flex-col sm:flex-row items-center gap-8 group"
                                    >
                                        <div className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={item.images?.[0]?.url || 'https://placehold.co/100x100?text=No+Img'}
                                                alt={item.title}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <Link to={`/products/${item._id}`} className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                                                {item.title}
                                            </Link>
                                            <p className="text-sm text-gray-400 mt-2 tracking-wide uppercase">{item.category}</p>
                                            <p className="text-primary-600 font-bold text-lg mt-3">{formatPrice(item.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center bg-gray-50 rounded-xl p-1">
                                                <button
                                                    onClick={() => updateCartItem(item._id, item.quantity - 1)}
                                                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all"
                                                >
                                                    <FiMinus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateCartItem(item._id, item.quantity + 1)}
                                                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all"
                                                >
                                                    <FiPlus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1, color: '#ef4444' }}
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-3 text-gray-400 hover:bg-red-50 rounded-xl transition-all"
                                                title="Remove item"
                                            >
                                                <FiTrash2 className="w-6 h-6" />
                                            </motion.button>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                            <Link to="/products" className="flex items-center text-gray-600 hover:text-primary-600 font-bold transition-colors group">
                                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Collection
                            </Link>
                            <button
                                onClick={clearCart}
                                className="text-gray-400 hover:text-red-500 text-sm font-bold uppercase tracking-widest transition-colors"
                            >
                                Empty Bag
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-24"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 italic">Summary</h2>
                        <div className="space-y-5 mb-8">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Lux Delivery</span>
                                <span className="text-primary-600 font-bold tracking-widest text-xs">COMPLIMENTARY</span>
                            </div>
                            <div className="border-t border-gray-100 pt-6 flex justify-between text-2xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-gray-900 text-white rounded-xl py-5 px-6 font-bold hover:bg-black transition-all shadow-xl shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                        >
                            {isCheckingOut ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <span>Proceed to Checkout</span>
                                </>
                            )}
                        </motion.button>
                        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Apex guarantees the authenticity of every item. Secure payment processing is ensured.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;
