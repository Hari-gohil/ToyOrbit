import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/categories/';

const getAllCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createCategory = async (formData) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.post(API_URL, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const deleteCategory = async (id) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.delete(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const categoryService = {
  getAllCategories,
  createCategory,
  deleteCategory,
};

export default categoryService;
