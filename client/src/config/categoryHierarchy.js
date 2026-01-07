export const categoryHierarchy = {
    'Electronics': {
        subCategories: {
            'Audio': {
                productTypes: {
                    'Bluetooth Headphones': { productType: 'bluetooth_headphones', related: ['wired_headphones', 'wired_earphones', 'bluetooth_speaker'] },
                    'Wired Headphones': { productType: 'wired_headphones', related: ['bluetooth_headphones', 'wired_earphones'] },
                    'Wired Earphones': { productType: 'wired_earphones', related: ['bluetooth_headphones', 'wired_headphones'] },
                    'Bluetooth Speakers': { productType: 'bluetooth_speaker', related: ['soundbar', 'home_theater'] },
                    'Soundbars': { productType: 'soundbar', related: ['bluetooth_speaker', 'home_theater'] },
                    'Home Theaters': { productType: 'home_theater', related: ['soundbar', 'bluetooth_speaker'] }
                }
            },
            'Cameras & Accessories': {
                productTypes: {
                    'DSLR Cameras': { productType: 'dslr_camera', related: ['mirrorless_camera', 'camera_tripod'] },
                    'Mirrorless Cameras': { productType: 'mirrorless_camera', related: ['dslr_camera', 'camera_tripod'] },
                    'Camera Tripods': { productType: 'camera_tripod', related: ['dslr_camera', 'gimbal'] },
                    'Drones': { productType: 'drone', related: ['action_camera', 'gimbal'] },
                    'Gimbals': { productType: 'gimbal', related: ['drone', 'action_camera'] },
                    'Action Cameras': { productType: 'action_camera', related: ['drone', 'gimbal'] }
                }
            },
            'Gaming': {
                productTypes: {
                    'Gaming Consoles': { productType: 'gaming_console', related: ['xbox_console', 'video_game', 'gamepad'] },
                    'Xbox Consoles': { productType: 'xbox_console', related: ['gaming_console', 'video_game', 'gamepad'] },
                    'Gaming Mouse': { productType: 'gaming_mouse', related: ['gaming_keyboard', 'gamepad'] },
                    'Gaming Keyboards': { productType: 'gaming_keyboard', related: ['gaming_mouse', 'gamepad'] },
                    'Gamepads': { productType: 'gamepad', related: ['gaming_console', 'xbox_console', 'video_game'] },
                    'Video Games': { productType: 'video_game', related: ['gaming_console', 'xbox_console', 'gamepad'] }
                }
            },
            'Laptop & Desktop': {
                productTypes: {
                    'Laptops': { productType: 'laptop', related: ['gaming_laptop', 'all_in_one_pc'] },
                    'Gaming Laptops': { productType: 'gaming_laptop', related: ['laptop', 'desktop_pc'] },
                    'Desktop PCs': { productType: 'desktop_pc', related: ['all_in_one_pc', 'mini_pc'] },
                    'All-in-One PCs': { productType: 'all_in_one_pc', related: ['desktop_pc', 'laptop'] },
                    'Mini PCs': { productType: 'mini_pc', related: ['desktop_pc', 'all_in_one_pc'] }
                }
            },
            'Smart Wearables': {
                productTypes: {
                    'Smart Watches': { productType: 'smart_watch', related: ['smart_band', 'fitness_tracker'] },
                    'Smart Bands': { productType: 'smart_band', related: ['smart_watch', 'fitness_tracker'] },
                    'Fitness Trackers': { productType: 'fitness_tracker', related: ['smart_watch', 'smart_band'] },
                    'Smart Glasses': { productType: 'smart_glasses', related: ['smart_watch', 'smart_ring'] },
                    'Smart Rings': { productType: 'smart_ring', related: ['smart_watch', 'smart_band'] }
                }
            }
        }
    },
    'Fashion': {
        subCategories: {
            'Mens': {
                productTypes: {
                    'T-Shirts': { productType: 'mens_tshirt', related: ['mens_shirt'] },
                    'Shirts': { productType: 'mens_shirt', related: ['mens_tshirt'] }
                }
            },
            'Womens': {
                productTypes: {
                    'Kurtas': { productType: 'womens_kurta', related: ['saree'] },
                    'Sarees': { productType: 'saree', related: ['womens_kurta'] }
                }
            },
            'Men Footwear': {
                productTypes: {
                    'Running Shoes': { productType: 'running_shoes', related: ['sneakers', 'formal_shoes'] },
                    'Formal Shoes': { productType: 'formal_shoes', related: ['running_shoes', 'sneakers'] },
                    'Sneakers': { productType: 'sneakers', related: ['running_shoes', 'formal_shoes'] }
                }
            },
            'Women Footwear': {
                productTypes: {
                    'Heels': { productType: 'heels', related: ['sneakers'] },
                    'Sneakers': { productType: 'sneakers', related: ['heels'] }
                }
            },
            'Kids': {
                productTypes: {
                    'Kids Clothing': { productType: 'kids_clothing', related: [] }
                }
            }
        }
    },
    'Home & Furniture': {
        subCategories: {
            'Home Furnishings': {
                productTypes: {
                    'Bed Sheets': { productType: 'bedsheet', related: ['mattress'] }
                }
            },
            'Bedroom Furniture': {
                productTypes: {
                    'Mattresses': { productType: 'mattress', related: ['bedsheet', 'sofa'] }
                }
            },
            'Furniture': {
                productTypes: {
                    'Sofas': { productType: 'sofa', related: ['mattress'] }
                }
            },
            'Kitchen & Dining': {
                productTypes: {
                    'Pressure Cookers': { productType: 'pressure_cooker', related: [] }
                }
            },
            'Lighting & Electrical': {
                productTypes: {
                    'LED Bulbs': { productType: 'led_bulb', related: [] }
                }
            }
        }
    },
    'TV & Appliances': {
        subCategories: {
            'Televisions': {
                productTypes: {
                    'Smart TVs': { productType: 'smart_tv', related: [] }
                }
            }
        }
    },
    'Mobiles & Tablets': {
        subCategories: {
            'Smartphones': {
                productTypes: {
                    'Smartphones': { productType: 'smartphone', related: ['tablet'] }
                }
            },
            'Tablets': {
                productTypes: {
                    'Tablets': { productType: 'tablet', related: ['smartphone'] }
                }
            }
        }
    },
    'Bags': {
        subCategories: {
            'Travel Bags': {
                productTypes: {
                    'Duffle Bags': { productType: 'duffle_bag', related: ['backpack', 'hiking_bag'] },
                    'Backpacks': { productType: 'backpack', related: ['duffle_bag', 'hiking_bag'] },
                    'Hiking Bags': { productType: 'hiking_bag', related: ['backpack', 'duffle_bag'] }
                }
            },
            'Fashion Bags': {
                productTypes: {
                    'Tote Bags': { productType: 'tote_bag', related: ['backpack'] }
                }
            }
        }
    }
};

export const getMainCategories = () => {
    return Object.keys(categoryHierarchy);
};

export const getSubCategories = (mainCategory) => {
    const cat = categoryHierarchy[mainCategory];
    if (!cat || !cat.subCategories) return [];
    return Object.keys(cat.subCategories);
};

export const getProductTypes = (mainCategory, subCategory) => {
    const cat = categoryHierarchy[mainCategory];
    if (!cat || !cat.subCategories) return [];
    const sub = cat.subCategories[subCategory];
    if (!sub || !sub.productTypes) return [];
    return Object.keys(sub.productTypes);
};

export const getProductTypeConfig = (mainCategory, subCategory, productTypeName) => {
    const cat = categoryHierarchy[mainCategory];
    if (!cat || !cat.subCategories) return null;
    const sub = cat.subCategories[subCategory];
    if (!sub || !sub.productTypes) return null;
    return sub.productTypes[productTypeName] || null;
};

export const findProductTypeByKey = (productTypeKey) => {
    for (const mainCat of Object.keys(categoryHierarchy)) {
        const subs = categoryHierarchy[mainCat].subCategories;
        if (!subs) continue;
        for (const subCat of Object.keys(subs)) {
            const types = subs[subCat].productTypes;
            if (!types) continue;
            for (const typeName of Object.keys(types)) {
                if (types[typeName].productType === productTypeKey) {
                    return {
                        mainCategory: mainCat,
                        subCategory: subCat,
                        productTypeName: typeName,
                        config: types[typeName]
                    };
                }
            }
        }
    }
    return null;
};

export const productTypeToDisplayName = (productTypeKey) => {
    const info = findProductTypeByKey(productTypeKey);
    if (info) return info.productTypeName;
    return productTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
