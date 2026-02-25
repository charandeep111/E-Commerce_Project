import React from 'react';
import { FiGrid, FiChevronRight } from 'react-icons/fi';

const CategoryGrid = ({ items, level, onItemClick }) => {
    if (!items || items.length === 0) return null;

    const getLevelStyles = () => {
        switch (level) {
            case 'root':
            case 'category':
                return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
            case 'subCategory':
                return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
            case 'productType':
                return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
            default:
                return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
        }
    };

    const getCardStyles = () => {
        switch (level) {
            case 'root':
            case 'category':
                return 'bg-gradient-to-br from-primary-50 to-white border-primary-100';
            case 'subCategory':
                return 'bg-gradient-to-br from-gray-50 to-white border-gray-100';
            case 'productType':
                return 'bg-white border-gray-100';
            default:
                return 'bg-white border-gray-100';
        }
    };

    return (
        <div className={`grid ${getLevelStyles()} gap-4`}>
            {items.map((item) => (
                <button
                    key={item._id || item.name || item.productType}
                    onClick={() => onItemClick(item)}
                    className={`group relative p-6 rounded-xl border ${getCardStyles()} hover:shadow-lg hover:border-primary-300 transition-all duration-300 text-left`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                <FiGrid className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                    {item.name}
                                </h3>
                                {item.hasChildren && (
                                    <p className="text-xs text-gray-500">Browse subcategories</p>
                                )}
                                {!item.hasChildren && (
                                    <p className="text-xs text-primary-600">View products</p>
                                )}
                            </div>
                        </div>
                        <FiChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                </button>
            ))}
        </div>
    );
};

export default CategoryGrid;
