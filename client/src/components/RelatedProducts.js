import React from 'react';
import ProductCard from './ProductCard';

const RelatedProducts = ({ products, title }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{title || 'Related Products'}</h2>
                <span className="text-sm text-gray-500">{products.length} items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
