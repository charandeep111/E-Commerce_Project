import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setWishlist([]);
            return;
        }
        try {
            setLoading(true);
            const { data } = await api.get('/wishlist');
            setWishlist(data);
        } catch (err) {
            console.error('Failed to fetch wishlist', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (product) => {
        if (!user) return alert('Please login to add items to wishlist');
        try {
            await api.post('/wishlist', { productId: product._id });
            setWishlist(prev => [...prev, product]);
        } catch (err) {
            console.error('Failed to add to wishlist', err);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`);
            setWishlist(prev => prev.filter(item => item._id !== productId));
        } catch (err) {
            console.error('Failed to remove from wishlist', err);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
