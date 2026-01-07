const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const {
    createProduct,
    getProducts,
    getProductsWithRelated,
    getCategoryNavigation,
    getProduct,
    updateProduct,
    deleteProduct,
    getVendorProducts,
    getBrands,
    getRelatedProducts
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/with-related', getProductsWithRelated);
router.get('/navigation', getCategoryNavigation);
router.get('/brands', getBrands);
router.get('/vendor', protect, authorize('vendor'), getVendorProducts);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

router.post(
    '/',
    protect,
    authorize('vendor'),
    upload.array('images'),
    createProduct
);
router.put('/:id', protect, authorize('vendor'), updateProduct);
router.delete('/:id', protect, authorize('vendor'), deleteProduct);

module.exports = router;
