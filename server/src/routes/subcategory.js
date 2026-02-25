// src/routes/subcategory.js – Subcategory-specific routes
const express = require('express');
const router = express.Router();
const { getProductsBySubcategoryId } = require('../controllers/categoryController');

// GET /api/subcategories/:id/products → products in THIS subcategory ONLY
router.get('/:id/products', getProductsBySubcategoryId);

module.exports = router;
