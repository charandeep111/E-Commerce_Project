// src/models/Product.js – Product schema with ObjectId refs to Category & Subcategory
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Product title is required'], trim: true },
    price: { type: Number, required: [true, 'Product price is required'] },
    description: { type: String, default: '' },

    // Normalized references (ObjectId) — the core fix
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: [true, 'Subcategory is required'],
    },

    // Keep legacy string fields for backward compat (read-only, populated by seed)
    category: { type: String },
    subCategory: { type: String },

    brand: { type: String },
    productType: { type: String },
    discountPrice: { type: Number },
    images: [{ url: String, public_id: String }],
    stock: { type: Number, default: 0 },
    ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }],
}, { timestamps: true });

// Indexes for fast filtered queries
productSchema.index({ categoryId: 1 });
productSchema.index({ subcategoryId: 1 });
productSchema.index({ categoryId: 1, subcategoryId: 1 });

module.exports = mongoose.model('Product', productSchema);
