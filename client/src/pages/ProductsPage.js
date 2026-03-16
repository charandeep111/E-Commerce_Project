import React, { useEffect, useState, useCallback } from 'react'; // Triggering fresh deployment build
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import CategoryBreadcrumb from '../components/CategoryBreadcrumb';
import CategoryGrid from '../components/CategoryGrid';
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
    const [brands, setBrands] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);   // { _id, name, slug }
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // { _id, name, slug }
    const [selectedBrand, setSelectedBrand] = useState(null); // string (brand name)

    // Filters
    const [sort, setSort] = useState('newest');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || null);

    // Determine what level we're at
    const currentLevel = selectedBrand ? 'products' : selectedSubcategory ? 'brands' : selectedCategory ? 'subcategories' : 'categories';

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
            const { data } = await api.get(`/categories/${categoryId}/subcategories`);
            setSubcategories(data.subcategories || []);
        } catch (err) {
            console.error('Failed to fetch subcategories', err);
            setSubcategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Fetch brands for a subcategory ────────────────────────────
    const fetchBrands = useCallback(async (subCatName) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/brands?subCategory=${encodeURIComponent(subCatName)}`);
            setBrands(data || []);
        } catch (err) {
            console.error('Failed to fetch brands', err);
            setBrands([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Fetch products ───────────────────
    const fetchProducts = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            let query = `?`;
            if (sort && sort !== 'newest') query += `sort=${sort}&`;
            if (search) query += `search=${encodeURIComponent(search)}&`;
            if (params.category) query += `category=${encodeURIComponent(params.category)}&`;
            if (params.brand) query += `brand=${encodeURIComponent(params.brand)}&`;

            let endpoint = '/products';
            if (params.subcategoryId) {
                endpoint = `/subcategories/${params.subcategoryId}/products`;
            }

            const { data } = await api.get(`${endpoint}${query}`);
            setProducts(data.products || (Array.isArray(data) ? data : []));
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
        const brand = searchParams.get('brand');
        const searchQ = searchParams.get('search');

        if (searchQ) setSearch(searchQ);

        if (brand && subId) {
            (async () => {
                try {
                    const { data } = await api.get(`/subcategories/${subId}/products?brand=${encodeURIComponent(brand)}`);
                    setSelectedSubcategory(data.subcategory);
                    setSelectedCategory(data.subcategory.categoryId);
                    setSelectedBrand(brand);
                    setProducts(data.products || []);
                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    setLoading(false);
                }
            })();
        } else if (subId) {
            (async () => {
                try {
                    const { data } = await api.get(`/subcategories/${subId}/products`);
                    setSelectedSubcategory(data.subcategory);
                    setSelectedCategory(data.subcategory.categoryId);
                    fetchBrands(data.subcategory.name);
                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    setLoading(false);
                }
            })();
        } else if (catId) {
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
    }, []);

    // ─── Navigation handlers ─────────────────────────────────────────
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
        setSelectedBrand(null);
        setProducts([]);
        setBrands([]);
        setError('');

        const params = new URLSearchParams();
        params.set('categoryId', category._id);
        setSearchParams(params);

        fetchSubcategories(category._id);
    };

    const handleSubcategoryClick = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setSelectedBrand(null);
        setProducts([]);
        setError('');

        const params = new URLSearchParams();
        params.set('categoryId', selectedCategory._id);
        params.set('subcategoryId', subcategory._id);
        setSearchParams(params);

        fetchBrands(subcategory.name);
    };

    const handleBrandClick = (brandName) => {
        setSelectedBrand(brandName);
        setError('');

        const params = new URLSearchParams();
        params.set('categoryId', selectedCategory._id);
        params.set('subcategoryId', selectedSubcategory._id);
        params.set('brand', brandName);
        setSearchParams(params);

        fetchProducts({ subcategoryId: selectedSubcategory._id, brand: brandName });
    };

    const handleBreadcrumbNavigate = (level) => {
        if (level === 'root') {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
            setSelectedBrand(null);
            setProducts([]);
            setSubcategories([]);
            setBrands([]);
            setSearchParams({});
        } else if (level === 'category') {
            setSelectedSubcategory(null);
            setSelectedBrand(null);
            setProducts([]);
            setBrands([]);
            const params = new URLSearchParams();
            params.set('categoryId', selectedCategory._id);
            setSearchParams(params);
            fetchSubcategories(selectedCategory._id);
        } else if (level === 'subCategory') {
            setSelectedBrand(null);
            setProducts([]);
            const params = new URLSearchParams();
            params.set('categoryId', selectedCategory._id);
            params.set('subcategoryId', selectedSubcategory._id);
            setSearchParams(params);
            fetchBrands(selectedSubcategory.name);
        }
    };

    const handleCategoryFilterClick = (catName) => {
        if (activeCategory === catName) {
            clearFilters();
        } else {
            const catObj = categories.find(c => c.name === catName);
            if (catObj) {
                setActiveCategory(null);
                setSelectedCategory(catObj);
                setSelectedSubcategory(null);
                setSelectedBrand(null);
                setProducts([]);
                setBrands([]);
                setError('');

                const params = new URLSearchParams();
                params.set('categoryId', catObj._id);
                setSearchParams(params);

                fetchSubcategories(catObj._id);
            }
        }
    };

    const clearFilters = () => {
        setSearchParams({});
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSelectedBrand(null);
        setActiveCategory(null);
        setProducts([]);
        setSubcategories([]);
        setBrands([]);
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
        if (selectedBrand) {
            breadcrumb.push({
                level: 'brand',
                name: selectedBrand,
                value: selectedBrand,
            });
        }
        return breadcrumb;
    };

    const getPageTitle = () => {
        if (selectedBrand) return `${selectedBrand} ${selectedSubcategory.name}`;
        if (selectedSubcategory) return `All ${selectedSubcategory.name} Brands`;
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
                onNavigate={(catVal, subVal, brandVal) => {
                    if (!catVal && !subVal && !brandVal) handleBreadcrumbNavigate('root');
                    else if (catVal && !subVal && !brandVal) handleBreadcrumbNavigate('category');
                    else if (catVal && subVal && !brandVal) handleBreadcrumbNavigate('subCategory');
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

                        <div className="mb-6">
                            <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryFilterClick(cat.name)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                            selectedCategory && selectedCategory._id === cat._id
                                                ? 'bg-primary-50 text-primary-700 font-semibold border border-primary-100 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{cat.name}</span>
                                            {selectedCategory && selectedCategory._id === cat._id && <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {showProducts && (
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
                        categories.length > 0 ? (
                            <CategoryGrid
                                items={categories.map(cat => ({
                                    ...cat,
                                    type: 'category',
                                    hasChildren: true,
                                }))}
                                level="root"
                                onItemClick={(item) => handleCategoryClick(item)}
                            />
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500">No categories found in this directory.</p>
                            </div>
                        )
                    )}

                    {/* Level: Subcategories */}
                    {currentLevel === 'subcategories' && !loading && (
                        subcategories.length > 0 ? (
                            <CategoryGrid
                                items={subcategories.map(sub => ({
                                    ...sub,
                                    type: 'subCategory',
                                    hasChildren: true,
                                }))}
                                level="subCategory"
                                onItemClick={(item) => handleSubcategoryClick(item)}
                            />
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500">This category is currently empty. Please check back later.</p>
                                <button onClick={() => handleBreadcrumbNavigate('root')} className="mt-2 text-primary-600 underline">Back to All Categories</button>
                            </div>
                        )
                    )}

                    {/* Level: Brands */}
                    {currentLevel === 'brands' && !loading && (
                        brands.length > 0 ? (
                            <CategoryGrid
                                items={brands.map(brand => ({
                                    name: brand,
                                    type: 'brand',
                                    hasChildren: false,
                                }))}
                                level="productType" // Reuse productType styles for brands
                                onItemClick={(item) => handleBrandClick(item.name)}
                            />
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500">No brands are currently listed in this subcategory.</p>
                                <button onClick={() => handleBreadcrumbNavigate('category')} className="mt-2 text-primary-600 underline">Back to Subcategories</button>
                            </div>
                        )
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
                                    <p className="text-gray-500">No products found for this selection.</p>
                                </div>
                            ) : (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </>
                    )}

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
