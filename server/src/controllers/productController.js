const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { resolveProductImagesFromDoc, getImagesForProductType } = require('../config/imageRegistry');
const {
    getRelatedProductTypes,
    findProductTypeByKey
} = require('../config/categoryHierarchy');

const DIRECT_PRODUCT_CATEGORIES = ['TV & Appliances', 'Mobiles & Tablets'];

exports.createProduct = async (req, res) => {
    try {
        const { title, price, description, category, stock, productType } = req.body;
        const imageUploads = [];
        if (req.files && req.files.length) {
            const uploadToCloudinary = (file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'products' },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve({ url: result.secure_url, public_id: result.public_id });
                        }
                    );
                    stream.end(file.buffer);
                });
            };
            for (const file of req.files) {
                const uploaded = await uploadToCloudinary(file);
                imageUploads.push(uploaded);
            }
        }

        let finalImages = imageUploads;
        if (finalImages.length === 0 && productType) {
            const { getImagesForProductType } = require('../config/imageRegistry');
            const registryImages = getImagesForProductType(productType, req.body.brand);
            finalImages = registryImages.map((url, index) => ({
                url: url,
                public_id: `registry_${productType}_${index}`
            }));
        }

        const product = new Product({
            vendorId: req.user.id,
            title,
            price,
            description,
            category,
            stock,
            productType,
            images: finalImages,
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 20, category, subCategory, productType, brand, minPrice, maxPrice, sort, search } = req.query;

        let filter = {};
        if (category) filter.category = category;
        if (subCategory) filter.subCategory = subCategory;
        if (productType) filter.productType = productType;
        if (brand) filter.brand = brand;
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let sortOption = {};
        if (sort === 'priceLow') sortOption.price = 1;
        else if (sort === 'priceHigh') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else sortOption.createdAt = -1;

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('vendorId', 'name');

        const resolvedProducts = products.map(resolveProductImagesFromDoc);

        res.json(resolvedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getProductsWithRelated = async (req, res) => {
    try {
        const { category, subCategory, productType, brand, minPrice, maxPrice, sort, page = 1, limit = 20, search } = req.query;

        let filter = {};
        if (category) filter.category = category;
        if (subCategory) filter.subCategory = subCategory;
        if (productType) filter.productType = productType;
        if (brand) filter.brand = brand;
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let sortOption = {};
        if (sort === 'priceLow') sortOption.price = 1;
        else if (sort === 'priceHigh') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else sortOption.createdAt = -1;

        const primaryProducts = await Product.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('vendorId', 'name');

        const resolvedPrimary = primaryProducts.map(resolveProductImagesFromDoc);

        let relatedProducts = [];
        if (productType) {
            const relatedTypes = getRelatedProductTypes(productType);
            if (relatedTypes.length > 0) {
                const relatedFilter = { productType: { $in: relatedTypes } };
                if (category) relatedFilter.category = category;

                const related = await Product.find(relatedFilter)
                    .sort(sortOption)
                    .limit(8)
                    .populate('vendorId', 'name');

                relatedProducts = related.map(resolveProductImagesFromDoc);
            }
        }

        res.json({
            primary: resolvedPrimary,
            related: relatedProducts,
            meta: {
                category,
                subCategory,
                productType,
                primaryCount: resolvedPrimary.length,
                relatedCount: relatedProducts.length
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getCategoryNavigation = async (req, res) => {
    try {
        const { category, subCategory } = req.query;

        if (!category) {
            const categories = await Product.distinct('category');
            return res.json({
                level: 'root',
                items: categories.map(cat => ({
                    name: cat,
                    type: 'category',
                    hasChildren: !DIRECT_PRODUCT_CATEGORIES.includes(cat)
                }))
            });
        }

        if (DIRECT_PRODUCT_CATEGORIES.includes(category)) {
            return res.json({
                level: 'leaf',
                category,
                items: []
            });
        }

        if (category && !subCategory) {
            const subCategories = await Product.distinct('subCategory', { category });
            const validSubs = subCategories.filter(sub => sub !== null && sub !== undefined && sub !== '');

            if (validSubs.length === 0) {
                return res.json({
                    level: 'leaf',
                    category,
                    items: []
                });
            }

            return res.json({
                level: 'subCategory',
                category,
                items: validSubs.map(sub => ({
                    name: sub,
                    type: 'subCategory',
                    hasChildren: true
                }))
            });
        }

        if (category && subCategory) {
            const productTypes = await Product.distinct('productType', { category, subCategory });
            const validTypes = productTypes.filter(pt => pt !== null && pt !== undefined && pt !== '');

            return res.json({
                level: 'productType',
                category,
                subCategory,
                items: validTypes.map(pt => {
                    const info = findProductTypeByKey(pt);
                    return {
                        name: info ? info.productTypeName : pt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        productType: pt,
                        type: 'productType',
                        hasChildren: false
                    };
                })
            });
        }

        res.json({ level: 'unknown', items: [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const { category, subCategory, productType } = req.query;
        let filter = {};
        if (category) filter.category = category;
        if (subCategory) filter.subCategory = subCategory;
        if (productType) filter.productType = productType;

        const brands = await Product.distinct('brand', filter);
        res.json(brands.filter(b => b && b !== 'Generic'));
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getVendorProducts = async (req, res) => {
    try {
        const products = await Product.find({ vendorId: req.user.id });
        const resolvedProducts = products.map(resolveProductImagesFromDoc);
        res.json(resolvedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('vendorId', 'name');
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        const productObj = resolveProductImagesFromDoc(product);
        res.json(productObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.vendorId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to edit this product' });
        }
        const updates = req.body;
        Object.assign(product, updates);
        await product.save();

        const productObj = resolveProductImagesFromDoc(product);
        res.json(productObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.vendorId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to delete this product' });
        }
        await product.deleteOne();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        let relatedProducts = [];
        if (product.productType) {
            const relatedTypes = getRelatedProductTypes(product.productType);
            const filter = {
                _id: { $ne: product._id },
                productType: { $in: relatedTypes.length > 0 ? relatedTypes : [product.productType] }
            };

            const related = await Product.find(filter)
                .limit(4)
                .populate('vendorId', 'name');

            relatedProducts = related.map(resolveProductImagesFromDoc);
        }

        res.json(relatedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
