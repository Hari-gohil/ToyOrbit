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
        const token = localStorage.getItem('admin_token');
        if (token) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Ensure it's an admin
          if (res.data.user.role === 'admin') {
            setUser(res.data.user);
          } else {
            // If normal user tries to log in to admin portal
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
          }
        } else {
          // Fallback if no token but user in local storage
          const localUser = localStorage.getItem('admin_user');
          if (localUser) {
            const parsed = JSON.parse(localUser);
            if (parsed.role === 'admin') setUser(parsed);
          }
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Auth check failed:", error);
        }
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.user.role !== 'admin') {
      authService.logout();
      throw new Error("Access denied. Admin privileges required.");
    }
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
