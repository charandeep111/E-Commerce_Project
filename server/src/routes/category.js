// src/routes/category.js – Category & Subcategory routes
const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryById,
    getSubcategoriesByCategoryId,
    getProductsByCategoryId,
    getProductsBySubcategoryId,
} = require('../controllers/categoryController');

// GET /api/categories              → list all categories
router.get('/', getCategories);

// GET /api/categories/:id          → single category
router.get('/:id', getCategoryById);

// GET /api/categories/:id/subcategories → subcategories belonging to THIS category ONLY
router.get('/:id/subcategories', getSubcategoriesByCategoryId);

// GET /api/categories/:id/products → all products in a category
router.get('/:id/products', getProductsByCategoryId);

module.exports = router;
