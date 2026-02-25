// src/models/Subcategory.js – Normalized Subcategory model with categoryId reference
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subcategory name is required'],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Subcategory slug is required'],
        lowercase: true,
        trim: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category reference is required'],
    },
    image: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Index on categoryId for fast filtered lookups
subcategorySchema.index({ categoryId: 1 });
// Compound unique: no duplicate subcategory names within the same category
subcategorySchema.index({ categoryId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Subcategory', subcategorySchema);
