import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/products/';

const getAllProducts = async (page = 1, limit = 100) => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  return response.data;
};

const createProduct = async (formData) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.post(API_URL, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const getProductById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

const updateProduct = async (id, formData) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.put(API_URL + id, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const deleteProduct = async (id) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.delete(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
