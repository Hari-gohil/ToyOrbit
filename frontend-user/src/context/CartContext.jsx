import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.cart || { items: [], totalItems: 0, totalPrice: 0 });
    } catch (error) {
      if (error.response?.status !== 401) console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, 
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to remove from cart", error);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/cart/update/${productId}`, 
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to update cart item", error);
    }
  };

  const clearCart = async () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateCartItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
