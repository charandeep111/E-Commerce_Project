import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';

const OrderSuccessPage = () => {
    // Determine if we need to fetch the last order details or just show generic success message
    // For now, let's just show a success message.

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <FiCheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">Order Placed!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. Your order has been successfully placed and is being processed. You will receive an email confirmation shortly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* We could link to an 'Orders' page if we had one */}
                    <Link
                        to="/products"
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors flex items-center justify-center"
                    >
                        <FiPackage className="mr-2" /> Continue Shopping
                    </Link>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-primary-500/30"
                    >
                        <FiHome className="mr-2" /> Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
