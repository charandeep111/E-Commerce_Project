import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiPackage, FiUser, FiClock } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';

const ProfilePage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'customer') {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return <div className="text-center py-12">Please login to view profile.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                <FiUser className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-500 capitalize">{user.role}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600">
                                <span className="font-medium mr-2">Email:</span>
                                {user.email}
                            </div>
                            {/* Placeholders for future fields */}
                            <div className="flex items-center text-gray-600">
                                <span className="font-medium mr-2">Member Since:</span>
                                {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List (Only for customers) */}
                {user.role === 'customer' && (
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                                <FiPackage className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No orders found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <div>
                                                <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900">#{order._id.slice(-6)}</span></p>
                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                    <FiClock className="mr-1.5 h-4 w-4" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'}`}>
                                                    {order.status}
                                                </span>
                                                <p className="text-lg font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                                            </div>
                                        </div>
                                        <div className="px-6 py-4">
                                            <ul className="divide-y divide-gray-100">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="py-3 flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                                {/* Assuming product population includes images, but in controller we only populated 'title price'. Let's update controller if needed, or stick with title. Update says 'images' populated? I added 'images' to population string in step 1. */}
                                                                <img
                                                                    src={item.product.images?.[0]?.url || 'https://placehold.co/50x50'}
                                                                    alt={item.product.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{item.product.title}</p>
                                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-900 font-medium">{formatPrice(item.price)}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Vendor specific placeholder */}
                {user.role === 'vendor' && (
                    <div className="md:col-span-2">
                        <div className="bg-primary-50 rounded-xl p-8 text-center">
                            <h3 className="text-xl font-bold text-primary-800 mb-2">Vendor Dashboard</h3>
                            <p className="text-primary-600 mb-6">Manage your products and view sales in the dedicated vendor dashboard.</p>
                            {/* Link to vendor dashboard */}
                            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
