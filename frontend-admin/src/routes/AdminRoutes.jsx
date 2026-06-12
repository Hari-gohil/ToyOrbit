import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/Dashboard';

import Products from '../pages/Products';
import CreateProducts from '../pages/CreateProducts';
import UpdateProduct from '../pages/UpdateProduct';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Categories from '../pages/Categories';
import Customers from '../pages/Customers';
import Reviews from '../pages/Reviews';
import ReturnRequests from '../pages/ReturnRequests';
import Profile from '../pages/Profile';

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected Admin Routes */}
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        
        {/* Product Routes */}
        <Route path="products" element={<Products />} />
        <Route path="products/create" element={<CreateProducts />} />
        <Route path="products/edit/:id" element={<UpdateProduct />} />
        
        {/* Placeholders for future pages */}
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="categories" element={<Categories />} />
        <Route path="users" element={<Customers />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="returns" element={<ReturnRequests />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<div className="p-4">Settings Page Coming Soon</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
