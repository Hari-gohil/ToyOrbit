import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/reviews/';

const getProductReviews = async (productId) => {
  const response = await axios.get(`${API_URL}product/${productId}`);
  return response.data;
};

const createReview = async (reviewData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, reviewData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const reviewService = {
  getProductReviews,
  createReview,
};

export default reviewService;
