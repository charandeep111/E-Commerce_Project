import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user: authUser } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Check if user is logged in via AuthContext
    const isLoggedIn = !!authUser;

    // Fetch cart from backend
    const fetchCart = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            setLoading(true);
            const { data } = await api.get('/cart');
            // Backend returns user.cart which is an array of { productId, quantity }
            // We need to map it to have the same structure as the local cart if needed
            // The controller populates 'cart.productId'
            const items = data
                .filter(item => item.productId) // Safety check for deleted products
                .map(item => ({
                    ...item.productId,
                    quantity: item.quantity,
                    _id: item.productId._id
                }));
            setCartItems(items);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    // Load cart on mount or login
    useEffect(() => {
        if (isLoggedIn) {
            fetchCart();
        } else {
            const savedCart = localStorage.getItem('luxe_cart');
            if (savedCart) {
                try {
                    setCartItems(JSON.parse(savedCart));
                } catch (error) {
                    console.error("Failed to parse cart from local storage", error);
                }
            } else {
                setCartItems([]);
            }
        }
    }, [isLoggedIn, fetchCart]);

    // Save local cart to localStorage for guests
    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem('luxe_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoggedIn]);

    const addToCart = async (product, quantity = 1) => {
        if (isLoggedIn) {
            try {
                const { data } = await api.post('/cart/add', { productId: product._id, quantity });
                const items = data
                    .filter(item => item.productId)
                    .map(item => ({
                        ...item.productId,
                        quantity: item.quantity,
                        _id: item.productId._id
                    }));
                setCartItems(items);
                toast.success("Added to synchronized cart!");
            } catch (error) {
                toast.error("Failed to add to cart");
            }
        } else {
            setCartItems(prev => {
                const existingItem = prev.find(item => item._id === product._id);
                if (existingItem) {
                    return prev.map(item =>
                        item._id === product._id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prev, { ...product, quantity }];
            });
            toast.success("Added to guest cart!");
        }
    };

    const updateCartItem = async (productId, quantity) => {
        if (isLoggedIn) {
            try {
                const { data } = await api.put('/cart/update', { productId, quantity });
                const items = data
                    .filter(item => item.productId)
                    .map(item => ({
                        ...item.productId,
                        quantity: item.quantity,
                        _id: item.productId._id
                    }));
                setCartItems(items);
            } catch (error) {
                toast.error("Failed to update cart");
            }
        } else {
            setCartItems(prev =>
                prev.map(item =>
                    item._id === productId
                        ? { ...item, quantity: Math.max(1, quantity) }
                        : item
                )
            );
        }
    };

    const removeFromCart = async (productId) => {
        if (isLoggedIn) {
            try {
                const { data } = await api.post('/cart/remove', { productId });
                const items = data
                    .filter(item => item.productId)
                    .map(item => ({
                        ...item.productId,
                        quantity: item.quantity,
                        _id: item.productId._id
                    }));
                setCartItems(items);
                toast.success("Removed from cart");
            } catch (error) {
                toast.error("Failed to remove item");
            }
        } else {
            setCartItems(prev => prev.filter(item => item._id !== productId));
            toast.success("Removed from guest cart");
        }
    };

    const clearCart = async () => {
        if (isLoggedIn) {
            try {
                await api.delete('/cart/clear');
                setCartItems([]);
            } catch (error) {
                toast.error("Failed to clear cart");
            }
        } else {
            setCartItems([]);
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);

    return (
        <CartContext.Provider value={{
            cart: { items: cartItems },
            loading,
            addToCart,
            updateCartItem,
            removeFromCart,
            clearCart,
            cartCount,
            cartTotal,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
