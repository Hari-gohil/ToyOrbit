import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/products/';

const getAllProducts = async (page = 1, limit = 12, categoryId = '', sort = '') => {
  let url = `${API_URL}?page=${page}&limit=${limit}`;
  if (categoryId) url += `&category=${categoryId}`;
  if (sort) url += `&sort=${sort}`;
  
  const response = await axios.get(url);
  return response.data;
};

const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}${id}`);
  return response.data;
};

const productService = {
  getAllProducts,
  getProductById,
};

export default productService;
