import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
        } else {
          // Fallback if no token
          const localUser = localStorage.getItem('user');
          if (localUser) setUser(JSON.parse(localUser));
        }
      } catch (error) {
        // Only log if it's not a standard 401 unauthorized (expired token)
        if (error.response?.status !== 401) {
          console.error("Auth check failed:", error);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    // Backend doesn't have a logout route; we just clear client state.
    authService.logout();
    setUser(null);
  };
  const toggleWishlist = async (product) => {
    if (!user) return false;
    
    // Check if the product is already in the wishlist. 
    // Wishlist might contain populated product objects or just IDs depending on how it was loaded.
    const isWishlisted = user.wishlist.some(w => (w._id || w) === product._id);
    let newWishlist;
    
    if (isWishlisted) {
      newWishlist = user.wishlist.filter(w => (w._id || w) !== product._id);
    } else {
      // Add the full product object to the array for optimistic UI
      newWishlist = [...user.wishlist, product];
    }
    
    setUser({ ...user, wishlist: newWishlist });
    
    try {
      const wishlistIds = newWishlist.map(w => w._id || w);
      await authService.updateProfile({ wishlist: wishlistIds });
      return !isWishlisted; // true if added, false if removed
    } catch (error) {
      console.error("Failed to update wishlist", error);
      // Revert on failure by checking user again
      return isWishlisted;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};
