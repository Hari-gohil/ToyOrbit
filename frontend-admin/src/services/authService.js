import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/auth/';

const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data.token) {
    localStorage.setItem('admin_token', response.data.token);
    localStorage.setItem('admin_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data.token) {
    localStorage.setItem('admin_token', response.data.token);
    localStorage.setItem('admin_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

const getProfile = async () => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.get(API_URL + 'profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const updateProfile = async (userData) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.put(API_URL + 'profile', userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.data.user) {
    localStorage.setItem('admin_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const authService = {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
};

export default authService;
