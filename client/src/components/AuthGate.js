import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiLock, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AuthGate = () => {
    const location = useLocation();
    
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center relative overflow-hidden"
            >
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-50 rounded-full opacity-50"></div>
                
                <div className="mb-8 flex justify-center relative">
                    <div className="relative">
                        <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                            <FiShoppingBag className="h-10 w-10" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 border border-gray-50">
                            <FiLock className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                    Exclusive Access
                </h2>
                <p className="text-gray-600 mb-10 max-w-xs mx-auto leading-relaxed">
                    You need to sign up or sign in to continue shopping and explore our curated premium collections.
                </p>

                <div className="space-y-4">
                    <Link
                        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                        className="block w-full py-4 px-6 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 transform hover:-translate-y-1 active:scale-95"
                    >
                        Sign In
                    </Link>
                    <Link
                        to={`/register?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                        className="block w-full py-4 px-6 bg-white text-primary-600 border-2 border-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        Create Account
                    </Link>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center space-x-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span className="text-xs font-medium uppercase tracking-widest">Secure Authentication</span>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthGate;
