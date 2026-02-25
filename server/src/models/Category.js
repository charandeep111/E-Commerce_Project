// src/models/Category.js – Normalized Category model
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Category slug is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    image: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Index for fast slug lookups
categorySchema.index({ slug: 1 });

module.exports = mongoose.model('Category', categorySchema);
