import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiPlus } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';

const VendorDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(true);

    // Form state for adding product
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        category: 'Electronics', // Default
        stock: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/products/vendor'),
                    api.get('/orders/vendor')
                ]);
                setProducts(productsRes.data);
                setOrders(ordersRes.data);
            } catch (error) {
                console.error("Failed to fetch vendor data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'vendor') {
            fetchData();
        }
    }, [user]);

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            console.error("Failed to delete product", error);
            alert("Failed to delete product");
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            // Note: If we implements image upload, we need FormData.
            // For now, let's just send JSON and maybe mocked images or update controller later.
            // The controller expects multipart/form-data if distinct from JSON? 
            // The controller code: `upload.array('images')` and checks `req.files`.
            // So we MUST send FormData even if empty or handle it.
            // Let's implement basic FormData.

            const formData = new FormData();
            formData.append('title', newProduct.title);
            formData.append('price', newProduct.price);
            formData.append('description', newProduct.description);
            formData.append('category', newProduct.category);
            formData.append('stock', newProduct.stock);
            // No image file input yet in this simple form, will fail or just have no images.

            const { data } = await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProducts([...products, data]);
            setShowAddModal(false);
            setNewProduct({ title: '', price: '', description: '', category: 'Electronics', stock: '' });
        } catch (error) {
            console.error("Failed to create product", error);
            alert("Failed to create product");
        }
    };

    if (!user || user.role !== 'vendor') {
        return <div className="p-8 text-center">Access Denied. Vendor only area.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Vendor Dashboard</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                    <FiPlus className="mr-2" /> Add Product
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 mb-8">
                <button
                    className={`pb-4 px-4 font-medium ${activeTab === 'products' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('products')}
                >
                    My Products
                </button>
                <button
                    className={`pb-4 px-4 font-medium ${activeTab === 'orders' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Received Orders
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <>
                    {activeTab === 'products' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                        <img className="h-10 w-10 object-cover" src={product.images[0]?.url || 'https://placehold.co/40x40'} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                                        <div className="text-sm text-gray-500">{product.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {/* Sold count not explicitly tracked in Product model, maybe add later */}
                                                -
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order #{order._id.slice(-6)}</p>
                                            <p className="font-bold text-gray-900">Customer: {order.customerId?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-bold text-primary-600 text-xl">{formatPrice(order.totalAmount)}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
                                        <ul className="space-y-2">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="flex justify-between text-sm">
                                                    <span>{item.quantity}x {item.product?.title || 'Unknown Product'}</span>
                                                    <span>{formatPrice(item.price)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <select
                                            className="border border-gray-300 rounded-md text-sm p-1"
                                            defaultValue={order.status}
                                        // Handle status change later
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="packed">Packed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Add Product Modal (Simple) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <input
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                                placeholder="Product Title"
                                value={newProduct.title}
                                onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                                required
                            />
                            <div className="flex space-x-4">
                                <input
                                    className="w-1/2 border border-gray-300 px-4 py-2 rounded-lg"
                                    placeholder="Price"
                                    type="number"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    required
                                />
                                <input
                                    className="w-1/2 border border-gray-300 px-4 py-2 rounded-lg"
                                    placeholder="Stock"
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    required
                                />
                            </div>
                            <input
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                                placeholder="Category"
                                value={newProduct.category}
                                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                required
                            />
                            <textarea
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                                placeholder="Description"
                                value={newProduct.description}
                                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                required
                            />

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Create Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorDashboard;
