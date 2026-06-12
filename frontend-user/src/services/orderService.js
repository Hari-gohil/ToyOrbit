import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/orders/';

const getMyOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL + 'my-orders', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getOrderById = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, orderData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const requestReturn = async (id, formData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}${id}/return`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  requestReturn,
};

export default orderService;
