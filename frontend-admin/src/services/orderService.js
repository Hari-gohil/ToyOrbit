import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

// Setup axios interceptor to add token
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const getAllOrders = async () => {
  const response = await axios.get(`${API_URL}/admin/all`, getAuthHeaders());
  return response.data;
};

const getOrderById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

const updateOrderStatus = async (id, orderStatus) => {
  const response = await axios.put(`${API_URL}/admin/${id}`, { orderStatus }, getAuthHeaders());
  return response.data;
};

const deleteOrder = async (id) => {
  const response = await axios.delete(`${API_URL}/admin/${id}`, getAuthHeaders());
  return response.data;
};

const getAllReturns = async () => {
  const response = await axios.get(`${API_URL}/returns`, getAuthHeaders());
  return response.data;
};

const updateReturnStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/returns/${id}`, { status }, getAuthHeaders());
  return response.data;
};

const orderService = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllReturns,
  updateReturnStatus,
};

export default orderService;
