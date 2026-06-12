import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/auth/';

const updateProfile = async (userData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(API_URL + 'profile', userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const userService = {
  updateProfile,
};

export default userService;
