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

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Navigation state — now uses ObjectId references
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);   // { _id, name, slug }
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // { _id, name, slug }

    // Filters
    const [sort, setSort] = useState('newest');
    const [search, setSearch] = useState(searchParams.get('search') || '');

    // Determine what level we're at
    const currentLevel = selectedSubcategory ? 'products' : selectedCategory ? 'subcategories' : 'categories';

    // ─── Fetch all categories (top level) ────────────────────────────
    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    }, []);

    // ─── Fetch subcategories for a specific category ─────────────────
    const fetchSubcategories = useCallback(async (categoryId) => {
        try {
            setLoading(true);
            // THE KEY ENDPOINT — only returns subcategories for THIS categoryId
            const { data } = await api.get(`/categories/${categoryId}/subcategories`);
            setSubcategories(data.subcategories || []);
        } catch (err) {
            console.error('Failed to fetch subcategories', err);
            setSubcategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Fetch products for a specific subcategory ───────────────────
    const fetchProducts = useCallback(async (subcategoryId) => {
        try {
            setLoading(true);
            let query = `?`;
            if (sort && sort !== 'newest') query += `sort=${sort}&`;
            if (search) query += `search=${encodeURIComponent(search)}&`;

            // THE KEY ENDPOINT — only returns products for THIS subcategoryId
            const { data } = await api.get(`/subcategories/${subcategoryId}/products${query}`);
            setProducts(data.products || []);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [sort, search]);

    // ─── Fetch all products for a category ───────────────────────────
    const fetchCategoryProducts = useCallback(async (categoryId) => {
        try {
            setLoading(true);
            let query = `?`;
            if (sort && sort !== 'newest') query += `sort=${sort}&`;
            if (search) query += `search=${encodeURIComponent(search)}&`;

            const { data } = await api.get(`/categories/${categoryId}/products${query}`);
            setProducts(data.products || []);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [sort, search]);

    // ─── Initialize: load categories ─────────────────────────────────
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // ─── Handle URL params on load ───────────────────────────────────
    useEffect(() => {
        const catId = searchParams.get('categoryId');
        const subId = searchParams.get('subcategoryId');
        const searchQ = searchParams.get('search');

        if (searchQ) setSearch(searchQ);

        if (subId) {
            // Subcategory selected — fetch products
            // We need to reconstruct the category/subcategory info
            (async () => {
                try {
                    const { data } = await api.get(`/subcategories/${subId}/products`);
                    setSelectedSubcategory(data.subcategory);
                    setSelectedCategory(data.subcategory.categoryId);
                    setProducts(data.products || []);
                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    setLoading(false);
                }
            })();
        } else if (catId) {
            // Category selected — fetch subcategories
            (async () => {
                try {
                    const { data } = await api.get(`/categories/${catId}/subcategories`);
                    setSelectedCategory(data.category);
                    setSubcategories(data.subcategories || []);
                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    setLoading(false);
                }
            })();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Refetch products when sort/search changes ───────────────────
    useEffect(() => {
        if (selectedSubcategory) {
            fetchProducts(selectedSubcategory._id);
        }
    }, [sort, search, selectedSubcategory, fetchProducts]);

    // ─── Navigation handlers ─────────────────────────────────────────
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
        setProducts([]);
        setError('');
        setSearch('');

        const params = new URLSearchParams();
        params.set('categoryId', category._id);
        setSearchParams(params);

        fetchSubcategories(category._id);
    };

    const handleSubcategoryClick = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setProducts([]);
        setError('');

        const params = new URLSearchParams();
        params.set('categoryId', selectedCategory._id);
        params.set('subcategoryId', subcategory._id);
        setSearchParams(params);

        fetchProducts(subcategory._id);
    };

    const handleBreadcrumbNavigate = (level) => {
        if (level === 'root') {
            // Go back to all categories
            setSelectedCategory(null);
            setSelectedSubcategory(null);
            setProducts([]);
            setSubcategories([]);
            setSearch('');
            setSearchParams({});
        } else if (level === 'category') {
            // Go back to subcategories
            setSelectedSubcategory(null);
            setProducts([]);
            setSearch('');
            const params = new URLSearchParams();
            params.set('categoryId', selectedCategory._id);
            setSearchParams(params);
            fetchSubcategories(selectedCategory._id);
        }
    };

    const clearFilters = () => {
        setSearchParams({});
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setProducts([]);
        setSubcategories([]);
        setSearch('');
        setSort('newest');
        setError('');
    };

    // ─── Build breadcrumb ────────────────────────────────────────────
    const getBreadcrumb = () => {
        const breadcrumb = [];
        if (selectedCategory) {
            breadcrumb.push({
                level: 'category',
                name: selectedCategory.name,
                value: selectedCategory._id,
            });
        }
        if (selectedSubcategory) {
            breadcrumb.push({
                level: 'subCategory',
                name: selectedSubcategory.name,
                value: selectedSubcategory._id,
            });
        }
        return breadcrumb;
    };

    const getPageTitle = () => {
        if (selectedSubcategory) return selectedSubcategory.name;
        if (selectedCategory) return selectedCategory.name;
        return 'Shop All Categories';
    };

    const showProducts = currentLevel === 'products';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>{getPageTitle()} - Apex</title>
                <meta name="description" content={`Explore ${getPageTitle()} at Apex. Premium quality products with best prices.`} />
            </Helmet>

            <CategoryBreadcrumb
                breadcrumb={getBreadcrumb()}
                onNavigate={(catVal, subVal) => {
                    if (!catVal && !subVal) handleBreadcrumbNavigate('root');
                    else if (catVal && !subVal) handleBreadcrumbNavigate('category');
                }}
            />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 font-display">Filters</h3>
                            <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-800">Clear All</button>
                        </div>

                        {showProducts && (
                            <>
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-700 mb-2">Search</h4>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </>
                        )}

                        {!showProducts && (
                            <p className="text-sm text-gray-500">Select a category to see filters</p>
                        )}
                    </div>
                </div>

                {/* Main Content */}
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

                    {/* Level: Categories */}
                    {currentLevel === 'categories' && !loading && (
                        <CategoryGrid
                            items={categories.map(cat => ({
                                ...cat,
                                type: 'category',
                                hasChildren: true,
                            }))}
                            level="root"
                            onItemClick={(item) => handleCategoryClick(item)}
                        />
                    )}

                    {/* Level: Subcategories */}
                    {currentLevel === 'subcategories' && !loading && (
                        <CategoryGrid
                            items={subcategories.map(sub => ({
                                ...sub,
                                type: 'subCategory',
                                hasChildren: true,
                            }))}
                            level="subCategory"
                            onItemClick={(item) => handleSubcategoryClick(item)}
                        />
                    )}

                    {/* Level: Products */}
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
                                    <p className="text-gray-500">No products found in this subcategory.</p>
                                    <button onClick={() => handleBreadcrumbNavigate('category')} className="mt-2 text-primary-600 font-medium hover:underline">
                                        Browse other subcategories
                                    </button>
                                </div>
                            ) : (
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
                            )}
                        </>
                    )}

                    {/* Loading for category/subcategory levels */}
                    {loading && currentLevel !== 'products' && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                    )}

                    {currentLevel === 'categories' && categories.length === 0 && !loading && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">No categories found. Please run the seed script.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
