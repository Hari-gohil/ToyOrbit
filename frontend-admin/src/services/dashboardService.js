import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/dashboard/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const getDashboardStats = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

const dashboardService = {
  getDashboardStats,
};

export default dashboardService;
