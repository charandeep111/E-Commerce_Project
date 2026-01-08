import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import CategoryBreadcrumb from '../components/CategoryBreadcrumb';
import CategoryGrid from '../components/CategoryGrid';
import RelatedProducts from '../components/RelatedProducts';
import { FiFilter } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const DIRECT_PRODUCT_CATEGORIES = ['TV & Appliances', 'Mobiles & Tablets'];

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [navigationItems, setNavigationItems] = useState([]);
    const [navigationLevel, setNavigationLevel] = useState('root');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [subCategory, setSubCategory] = useState(searchParams.get('subCategory') || '');
    const [productType, setProductType] = useState(searchParams.get('productType') || '');
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
    const [sort, setSort] = useState('newest');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [availableBrands, setAvailableBrands] = useState([]);

    const isDirectProductCategory = useCallback((cat) => {
        return DIRECT_PRODUCT_CATEGORIES.includes(cat);
    }, []);

    const shouldShowProductsDirectly = useCallback(() => {
        if (isDirectProductCategory(category)) {
            return true;
        }
        if (productType || search) {
            return true;
        }
        return false;
    }, [category, productType, isDirectProductCategory, search]);

    const getBreadcrumb = useCallback(() => {
        const breadcrumb = [];
        if (category) breadcrumb.push({ level: 'category', name: category, value: category });
        if (subCategory) breadcrumb.push({ level: 'subCategory', name: subCategory, value: subCategory });
        if (productType) {
            const displayName = productType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            breadcrumb.push({ level: 'productType', name: displayName, value: productType });
        }
        return breadcrumb;
    }, [category, subCategory, productType]);

    const fetchNavigation = useCallback(async () => {
        if (isDirectProductCategory(category)) {
            setNavigationItems([]);
            setNavigationLevel('leaf');
            return;
        }

        try {
            let query = '?';
            if (category) query += `category=${encodeURIComponent(category)}&`;
            if (subCategory) query += `subCategory=${encodeURIComponent(subCategory)}&`;

            const { data } = await api.get(`/products/navigation${query}`);
            let items = data.items || [];

            if (!category) {
                const landingCategories = [
                    'Electronics',
                    'Home & Furniture',
                    'Fashion',
                    'Mobiles & Tablets',
                    'TV & Appliances'
                ];
                items = items.filter(item => landingCategories.includes(item.name));
            }

            setNavigationItems(items);
            setNavigationLevel(data.level || 'root');
        } catch (err) {
            console.error('Failed to fetch navigation', err);
            setNavigationItems([]);
        }
    }, [category, subCategory, isDirectProductCategory]);

    const fetchBrands = useCallback(async () => {
        try {
            let query = '?';
            if (category) query += `category=${encodeURIComponent(category)}&`;
            if (subCategory) query += `subCategory=${encodeURIComponent(subCategory)}&`;
            if (productType) query += `productType=${encodeURIComponent(productType)}&`;

            const { data } = await api.get(`/products/brands${query}`);
            setAvailableBrands(data || []);
        } catch (err) {
            console.error('Failed to fetch brands', err);
        }
    }, [category, subCategory, productType]);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            let query = '?';
            if (category) query += `category=${encodeURIComponent(category)}&`;
            if (subCategory) query += `subCategory=${encodeURIComponent(subCategory)}&`;
            if (productType) query += `productType=${encodeURIComponent(productType)}&`;
            if (selectedBrand) query += `brand=${encodeURIComponent(selectedBrand)}&`;
            if (minPrice) query += `minPrice=${minPrice}&`;
            if (maxPrice) query += `maxPrice=${maxPrice}&`;
            if (sort) query += `sort=${sort}&`;
            if (search) query += `search=${encodeURIComponent(search)}&`;

            const { data } = await api.get(`/products/with-related${query}`);
            setProducts(data.primary || []);
            setRelatedProducts(data.related || []);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [category, subCategory, productType, selectedBrand, minPrice, maxPrice, sort, search]);

    useEffect(() => {
        setCategory(searchParams.get('category') || '');
        setSubCategory(searchParams.get('subCategory') || '');
        setProductType(searchParams.get('productType') || '');
        setSelectedBrand(searchParams.get('brand') || '');
        setSearch(searchParams.get('search') || '');
    }, [searchParams]);

    useEffect(() => {
        fetchNavigation();
        fetchBrands();
    }, [fetchNavigation, fetchBrands]);

    useEffect(() => {
        const showProducts = shouldShowProductsDirectly();
        if (showProducts) {
            fetchProducts();
        } else {
            setProducts([]);
            setRelatedProducts([]);
            setLoading(false);
        }
    }, [shouldShowProductsDirectly, fetchProducts]);

    const updateURL = (newCategory, newSubCategory, newProductType, newBrand, newSearch) => {
        const params = new URLSearchParams();
        if (newCategory) params.set('category', newCategory);
        if (newSubCategory) params.set('subCategory', newSubCategory);
        if (newProductType) params.set('productType', newProductType);
        if (newBrand) params.set('brand', newBrand);
        if (newSearch) params.set('search', newSearch);
        setSearchParams(params);
    };

    const handleNavigate = (newCategory, newSubCategory, newProductType) => {
        setCategory(newCategory || '');
        setSubCategory(newSubCategory || '');
        setProductType(newProductType || '');
        setSelectedBrand('');
        setSearch('');
        updateURL(newCategory, newSubCategory, newProductType, '', '');
    };

    const handleCategoryItemClick = (item) => {
        if (item.type === 'category') {
            handleNavigate(item.name, null, null);
        } else if (item.type === 'subCategory') {
            handleNavigate(category, item.name, null);
        } else if (item.type === 'productType') {
            handleNavigate(category, subCategory, item.productType);
        }
    };

    const clearFilters = () => {
        setSearchParams({});
        setCategory('');
        setSubCategory('');
        setProductType('');
        setSelectedBrand('');
        setMinPrice('');
        setMaxPrice('');
        setSearch('');
        setSort('newest');
    };

    const getPageTitle = () => {
        if (productType) {
            return productType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        if (subCategory) return subCategory;
        if (category) return category;
        return 'Shop All Categories';
    };

    const showProducts = shouldShowProductsDirectly();
    const shouldShowNavigation = !showProducts && navigationItems.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>{getPageTitle()} - Apex</title>
                <meta name="description" content={`Explore ${getPageTitle()} at Apex. Premium quality products with best prices.`} />
            </Helmet>

            <CategoryBreadcrumb breadcrumb={getBreadcrumb()} onNavigate={handleNavigate} />

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 font-display">Filters</h3>
                            <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-800">Clear All</button>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-medium text-gray-700 mb-2">Search</h4>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        updateURL(category, subCategory, productType, selectedBrand, e.target.value);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>

                        {showProducts && (
                            <>
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-1/2 p-2 border border-gray-300 rounded-md text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-1/2 p-2 border border-gray-300 rounded-md text-sm"
                                        />
                                    </div>
                                </div>

                                {availableBrands.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-700 mb-2">Brand</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                            {availableBrands.map(brand => (
                                                <label key={brand} className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBrand === brand}
                                                        onChange={() => {
                                                            const newBrand = selectedBrand === brand ? '' : brand;
                                                            setSelectedBrand(newBrand);
                                                            updateURL(category, subCategory, productType, newBrand);
                                                        }}
                                                        className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded"
                                                    />
                                                    <span>{brand}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {!showProducts && (
                            <p className="text-sm text-gray-500">Select a category to see filters</p>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                        <h1 className="text-2xl font-display font-bold text-gray-900">
                            {getPageTitle()}
                            {showProducts && <span className="text-gray-500 text-lg font-normal ml-2">({products.length})</span>}
                        </h1>

                        {showProducts && (
                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <div className="relative">
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm appearance-none bg-white"
                                    >
                                        <option value="newest">Newest Arrivals</option>
                                        <option value="priceLow">Price: Low to High</option>
                                        <option value="priceHigh">Price: High to Low</option>
                                        <option value="rating">Customer Rating</option>
                                    </select>
                                    <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        )}
                    </div>

                    {shouldShowNavigation && (
                        <div className="mb-8">
                            <CategoryGrid
                                items={navigationItems}
                                level={navigationLevel}
                                onItemClick={handleCategoryItemClick}
                            />
                        </div>
                    )}

                    {showProducts && (
                        <>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <p className="text-red-500">{error}</p>
                                    <button onClick={clearFilters} className="mt-2 text-primary-600 underline">Reset Filters</button>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500">No products found matching your filters.</p>
                                    <button onClick={clearFilters} className="mt-2 text-primary-600 font-medium hover:underline">Clear Filters</button>
                                </div>
                            ) : (
                                <>
                                    <motion.div
                                        layout
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        <AnimatePresence>
                                            {products.map((product) => (
                                                <ProductCard key={product._id} product={product} />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>

                                    {relatedProducts.length > 0 && (
                                        <RelatedProducts
                                            products={relatedProducts}
                                            title="You May Also Like"
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {!showProducts && !shouldShowNavigation && !loading && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Select a category to start browsing</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
