import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            toast.success('Successfully subscribed to newsletter!');
            setEmail('');
        } else {
            toast.error('Please enter a valid email address');
        }
    };

    return (
        <footer className="bg-dark-bg text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-display font-bold text-white mb-4 block hover:text-primary-400 transition-colors">
                            Apex
                        </Link>
                        <p className="text-dark-muted mb-4 text-sm leading-relaxed">
                            Your premier destination for luxury goods and premium shopping experiences. Multi-vendor marketplace connecting you with the best.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FiTwitter className="h-5 w-5" /></a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FiFacebook className="h-5 w-5" /></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FiInstagram className="h-5 w-5" /></a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FiGithub className="h-5 w-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-lg">Shop</h3>
                        <ul className="space-y-3 text-sm text-dark-muted">
                            <li><Link to="/products" className="hover:text-primary-400 transition-colors">All Products</Link></li>
                            <li><Link to="/products?category=Electronics" className="hover:text-primary-400 transition-colors">Electronics</Link></li>
                            <li><Link to="/products?category=Fashion" className="hover:text-primary-400 transition-colors">Fashion</Link></li>
                            <li><Link to="/products?category=Home & Furniture" className="hover:text-primary-400 transition-colors">Home & Furniture</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-lg">Account</h3>
                        <ul className="space-y-3 text-sm text-dark-muted">
                            <li><Link to="/profile" className="hover:text-primary-400 transition-colors">My Profile</Link></li>
                            <li><Link to="/cart" className="hover:text-primary-400 transition-colors">View Bag</Link></li>
                            <li><Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
                            <li><Link to="/register" className="hover:text-primary-400 transition-colors">Register</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-lg">Newsletter</h3>
                        <p className="text-dark-muted text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="px-4 py-3 bg-dark-card border border-gray-700 rounded-xl focus:outline-none focus:border-primary-500 text-white transition-all placeholder:text-gray-600"
                            />
                            <button
                                type="submit"
                                className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-900/20 active:scale-95"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-dark-muted gap-4">
                    <p>&copy; {new Date().getFullYear()} Apex. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <button onClick={() => toast('Privacy Policy coming soon!')} className="hover:text-white transition-colors">Privacy Policy</button>
                        <button onClick={() => toast('Terms of Service coming soon!')} className="hover:text-white transition-colors">Terms of Service</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
