import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiArrowLeft, FiTruck, FiShield, FiTag } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { formatPrice } from '../utils/formatPrice';
import RelatedProducts from '../components/RelatedProducts';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [adding, setAdding] = useState(false);

    const getVariants = () => {
        if (!product) return null;
        if (product.category === 'Fashion') {
            return {
                type: 'Size',
                options: ['S', 'M', 'L', 'XL']
            };
        }
        if (product.productType === 'smartphone' || product.productType === 'tablet') {
            return {
                type: 'Storage',
                options: ['128GB', '256GB']
            };
        }
        if (product.productType === 'laptop') {
            return {
                type: 'RAM',
                options: ['8GB', '16GB', '32GB']
            };
        }
        return null;
    };

    const variants = getVariants();

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const [productRes, relatedRes] = await Promise.all([
                    api.get(`/products/${id}`),
                    api.get(`/products/${id}/related`)
                ]);
                setProduct(productRes.data);
                setRelatedProducts(relatedRes.data);
            } catch (err) {
                setError('Failed to load product details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);

    const handleAddToCart = async () => {
        if (variants && !selectedVariant) {
            toast.error(`Please select a ${variants.type}`);
            return;
        }
        setAdding(true);
        addToCart(product, quantity);
        setAdding(false);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error || !product) return (
        <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error || 'Product not found'}</p>
            <Link to="/products" className="mt-4 inline-block text-primary-600 hover:text-primary-700">Back to Products</Link>
        </div>
    );

    const mainImage = product.images && product.images.length > 0
        ? product.images[selectedImage].url
        : 'https://placehold.co/600x600?text=No+Image';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>{product.title} - Apex</title>
                <meta name="description" content={product.description.substring(0, 160)} />
            </Helmet>
            <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors">
                <FiArrowLeft className="mr-2" /> Back to Products
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <motion.img
                            key={mainImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, idx) => (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    key={img.public_id || idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-primary-600 ring-2 ring-primary-100' : 'border-transparent hover:border-gray-300'}`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </motion.button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-6">
                        <span className="text-primary-600 font-medium tracking-wide text-sm">{product.category}</span>
                        <h1 className="text-4xl font-display font-bold text-gray-900 mt-2 mb-4">{product.title}</h1>
                        <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                        <p>{product.description}</p>
                    </div>

                    {variants && (
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Select {variants.type}</h3>
                            <div className="flex flex-wrap gap-3">
                                {variants.options.map(option => (
                                    <button
                                        key={option}
                                        onClick={() => setSelectedVariant(option)}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedVariant === option ? 'border-primary-600 bg-primary-50 text-primary-600 ring-1 ring-primary-600' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
                        <div className="flex items-center text-gray-600">
                            <FiTruck className="mr-3 h-5 w-5 text-primary-500" />
                            <span>Free shipping on orders over ₹10,000</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FiShield className="mr-3 h-5 w-5 text-primary-500" />
                            <span>2 year warranty included</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FiTag className="mr-3 h-5 w-5 text-primary-500" />
                            <span>Authenticity Guaranteed</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="w-full sm:w-32">
                            <label htmlFor="quantity" className="sr-only">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-center focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0 || adding}
                            className="flex-1 bg-primary-600 text-white rounded-lg py-3 px-6 font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {adding ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <FiShoppingCart className="mr-2 h-5 w-5" />
                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </>
                            )}
                        </button>
                    </div>

                    {product.vendorId && (
                        <div className="mt-4 text-xs text-gray-500">
                            Sold by <span className="font-medium text-gray-900">{product.vendorId.name}</span>
                        </div>
                    )}
                </motion.div>
            </div>

            {relatedProducts.length > 0 && (
                <RelatedProducts products={relatedProducts} title="Customers Also Viewed" />
            )}
        </div>
    );
};

export default ProductDetailsPage;
