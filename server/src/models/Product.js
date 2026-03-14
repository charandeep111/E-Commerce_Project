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
        required: false, // Made optional for more flexible string-based filtering
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: false, // Made optional
    },

    // Keep legacy string fields for backward compat (read-only, populated by seed)
    category: { type: String, index: true },
    subCategory: { type: String, index: true },

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
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
