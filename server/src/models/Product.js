// src/models/Product.js – Product schema for vendors
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    subCategory: { type: String },
    brand: { type: String },
    productType: { type: String },
    discountPrice: { type: Number },
    images: [{ url: String, public_id: String }],
    stock: { type: Number, default: 0 },
    ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
