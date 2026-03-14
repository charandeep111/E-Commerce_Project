import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Toaster position="top-center" />
      <Router>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<Home />} />
                  <Route 
                    path="/products" 
                    element={
                      <ProtectedRoute>
                        <ProductsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/products/:id" 
                    element={
                      <ProtectedRoute>
                        <ProductDetailsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/vendor-dashboard" 
                    element={
                      <ProtectedRoute>
                        <VendorDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route 
                    path="/wishlist" 
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Layout>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
