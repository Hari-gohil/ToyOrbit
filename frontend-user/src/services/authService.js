import axios from 'axios';

// Set base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL + '/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const updateProfile = async (userData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(API_URL + 'profile', userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  updateProfile,
};

export default authService;
