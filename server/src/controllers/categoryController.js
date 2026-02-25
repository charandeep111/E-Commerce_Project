// src/controllers/categoryController.js – Category & Subcategory API logic
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');

// ─── GET /api/categories ────────────────────────────────────────────
// Returns all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error('getCategories error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ─── GET /api/categories/:id ────────────────────────────────────────
// Returns a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'Invalid category ID' });
        }
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        res.json(category);
    } catch (err) {
        console.error('getCategoryById error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ─── GET /api/categories/:id/subcategories ──────────────────────────
// ** THE KEY FIX ** — Only returns subcategories that belong to THIS category
exports.getSubcategoriesByCategoryId = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid category ID' });
        }

        // Verify category exists
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Filtered query — ONLY subcategories with matching categoryId
        const subcategories = await Subcategory.find({ categoryId: id }).sort({ name: 1 });

        console.log(`[DEBUG] Category "${category.name}" (${id}) → ${subcategories.length} subcategories`);

        res.json({
            category,
            subcategories,
        });
    } catch (err) {
        console.error('getSubcategoriesByCategoryId error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ─── GET /api/subcategories/:id/products ────────────────────────────
// Returns products that belong to a specific subcategory
exports.getProductsBySubcategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20, sort, minPrice, maxPrice, brand, search } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid subcategory ID' });
        }

        const subcategory = await Subcategory.findById(id).populate('categoryId');
        if (!subcategory) {
            return res.status(404).json({ msg: 'Subcategory not found' });
        }

        // Build filter — ALWAYS scoped to this subcategoryId
        const filter = { subcategoryId: id };

        if (brand) filter.brand = brand;
        if (search) filter.title = { $regex: search, $options: 'i' };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Sort
        let sortOption = {};
        if (sort === 'priceLow') sortOption.price = 1;
        else if (sort === 'priceHigh') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else sortOption.createdAt = -1;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .populate('vendorId', 'name')
                .populate('categoryId', 'name slug')
                .populate('subcategoryId', 'name slug'),
            Product.countDocuments(filter),
        ]);

        // Resolve images
        const { resolveProductImagesFromDoc } = require('../config/imageRegistry');
        const resolvedProducts = products.map(resolveProductImagesFromDoc);

        console.log(`[DEBUG] Subcategory "${subcategory.name}" (${id}) → ${resolvedProducts.length} products`);

        res.json({
            subcategory,
            products: resolvedProducts,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('getProductsBySubcategoryId error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ─── GET /api/categories/:id/products ───────────────────────────────
// Returns ALL products within a category (across all its subcategories)
exports.getProductsByCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20, sort, search } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid category ID' });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        const filter = { categoryId: id };
        if (search) filter.title = { $regex: search, $options: 'i' };

        let sortOption = {};
        if (sort === 'priceLow') sortOption.price = 1;
        else if (sort === 'priceHigh') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else sortOption.createdAt = -1;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .populate('vendorId', 'name')
                .populate('categoryId', 'name slug')
                .populate('subcategoryId', 'name slug'),
            Product.countDocuments(filter),
        ]);

        const { resolveProductImagesFromDoc } = require('../config/imageRegistry');
        const resolvedProducts = products.map(resolveProductImagesFromDoc);

        res.json({
            category,
            products: resolvedProducts,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('getProductsByCategoryId error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
