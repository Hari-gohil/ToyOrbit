import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/users/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const getAllUsers = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

const updateUserStatus = async (id, isActive) => {
  const response = await axios.put(`${API_URL}${id}`, { isActive }, getAuthHeaders());
  return response.data;
};

const userService = {
  getAllUsers,
  updateUserStatus,
};

export default userService;
