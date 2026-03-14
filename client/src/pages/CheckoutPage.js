import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
    const { cart, cartTotal, loading, fetchCart } = useCart();
    const navigate = useNavigate();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        if (!orderPlaced) {
            navigate('/cart');
            return null;
        }
    }

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        try {
            await api.post('/orders/create');
            toast.success("Order placed successfully!");
            setOrderPlaced(true);
            await fetchCart(); // Re-fetch cart to update the context (should be empty now)
            setTimeout(() => {
                navigate('/order-success');
            }, 1000);
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(error.response?.data?.msg || "Failed to place order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-24 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <FiCheckCircle size={48} />
                </motion.div>
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Order Confirmed!</h2>
                <p className="text-gray-500 mb-8 text-lg">Thank you for your purchase. Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/cart" className="flex items-center text-gray-600 hover:text-primary-600 font-bold transition-colors mb-8 w-fit">
                <FiArrowLeft className="mr-2" /> Back to Cart
            </Link>

            <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 italic">Checkout</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                </div>
                <div className="p-8">
                    <ul className="divide-y divide-gray-100 mb-8">
                        {cart.items.map((item) => (
                            <li key={item._id} className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                        <img 
                                            src={item.images?.[0]?.url || 'https://placehold.co/100x100?text=No+Img'} 
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{item.title}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="space-y-4 pt-6 border-t border-gray-100 mb-8">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span className="text-green-500 font-bold font-mono">FREE</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
                            <span>Total</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder}
                        className="w-full bg-primary-600 text-white rounded-xl py-4 flex items-center justify-center font-bold hover:bg-primary-700 transition-colors shadow-xl shadow-primary-500/20 disabled:opacity-70"
                    >
                        {isPlacingOrder ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            'Confirm & Place Order'
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
