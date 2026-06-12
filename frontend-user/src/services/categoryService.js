import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/categories/';

const getAllCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const categoryService = {
  getAllCategories,
};

export default categoryService;
