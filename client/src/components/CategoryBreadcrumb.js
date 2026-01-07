import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

const CategoryBreadcrumb = ({ breadcrumb, onNavigate }) => {
    if (!breadcrumb || breadcrumb.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-sm mb-6">
            <button
                onClick={() => onNavigate(null, null, null)}
                className="text-gray-500 hover:text-primary-600 transition-colors"
            >
                All Categories
            </button>
            {breadcrumb.map((item, index) => (
                <React.Fragment key={item.value}>
                    <FiChevronRight className="text-gray-400 h-4 w-4" />
                    <button
                        onClick={() => {
                            if (item.level === 'category') {
                                onNavigate(item.value, null, null);
                            } else if (item.level === 'subCategory') {
                                onNavigate(breadcrumb[0].value, item.value, null);
                            }
                        }}
                        className={`transition-colors ${index === breadcrumb.length - 1
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-500 hover:text-primary-600'
                            }`}
                    >
                        {item.name}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
};

export default CategoryBreadcrumb;
