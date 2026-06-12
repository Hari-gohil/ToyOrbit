import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import MainLayout from '../layouts/MainLayout';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import ReturnProduct from '../pages/ReturnProduct';
import Wishlist from '../pages/Wishlist';

import Checkout from '../pages/Checkout';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes without Layout (Auth) */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Routes with Main Layout */}
      <Route path="/" element={<ProtectedRoute><MainLayout><Home /></MainLayout></ProtectedRoute>} />
      <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
      <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
      
      {/* Protected Routes */}
      <Route 
        path="/cart" 
        element={<ProtectedRoute><MainLayout><Cart /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/checkout" 
        element={<ProtectedRoute><MainLayout><Checkout /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/wishlist" 
        element={<ProtectedRoute><MainLayout><Wishlist /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/profile" 
        element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/orders" 
        element={<ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/order/:id" 
        element={<ProtectedRoute><MainLayout><OrderDetails /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/order/:id/return" 
        element={<ProtectedRoute><MainLayout><ReturnProduct /></MainLayout></ProtectedRoute>} 
      />

      {/* Fallback Route */}
      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  );
}
