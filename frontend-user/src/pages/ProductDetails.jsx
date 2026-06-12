import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination, Navigation } from 'swiper/modules';
import { FiShoppingCart, FiStar, FiArrowLeft, FiBox, FiShield, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';
import productService from '../services/productService';
import reviewService from '../services/reviewService';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, toggleWishlist } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [prodData, revData] = await Promise.all([
          productService.getProductById(id),
          reviewService.getProductReviews(id).catch(() => ({ reviews: [] }))
        ]);
        setProduct(prodData.product);
        setReviews(revData.reviews || []);
      } catch (error) {
        toast.error("Failed to load product details");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const isWishlisted = user?.wishlist?.some(w => (w._id || w) === product?._id);

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to wishlist items");
      return;
    }
    const added = await toggleWishlist(product);
    if (added) toast.success("Added to Wishlist");
  };

  const onSubmitReview = async (data) => {
    try {
      const reviewData = {
        product: product._id,
        rating: Number(data.rating),
        comment: data.comment
      };
      const res = await reviewService.createReview(reviewData);
      setReviews([res.review, ...reviews]);
      setShowReviewForm(false);
      reset();
      toast.success("Review submitted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) return <div className="py-20"><Loader /></div>;
  if (!product) return null;

  const defaultImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24px" fill="%239ca3af">No Image</text></svg>';
  const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');
  const images = product?.images?.length > 0 
    ? product.images.map(img => img.startsWith('/uploads') ? `${backendUrl}${img}` : img) 
    : [defaultImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-[var(--color-primary-600)] mb-8 transition-colors">
        <FiArrowLeft className="mr-2" /> Back to Products
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="md:flex">
          
          {/* Product Images */}
          <div className="md:w-1/2 p-6 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
            <Swiper
              modules={[SwiperPagination, Navigation]}
              pagination={{ clickable: true }}
              navigation
              className="w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center p-4">
                  <img src={img} alt={`${product.name} ${idx}`} className="max-w-full max-h-full object-contain" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6 md:p-12 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.category?.name && (
                <span className="bg-[var(--color-primary-50)] text-[var(--color-primary-600)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}
              {product.stock === 0 && (
                <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <button 
                onClick={handleWishlist}
                className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors group/btn shrink-0 ml-4"
              >
                <FiHeart 
                  size={24} 
                  className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/btn:text-red-500'}`} 
                />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center text-yellow-400">
                <FiStar className="fill-current" size={18} />
                <span className="ml-1 text-gray-900 font-bold">{product.averageRating || '0'}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500 text-sm">{product.totalReviews || 0} Reviews</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500 text-sm">Age: {product.ageGroup}</span>
            </div>

            <div className="mb-6 flex items-baseline gap-4">
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-4xl font-black text-gray-900">₹{product.discountPrice}</span>
                  <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                </>
              ) : (
                <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <FiBox className="text-[var(--color-primary-500)] mr-3" size={24} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Brand</p>
                  <p className="font-semibold text-gray-900">{product.brand || 'Generic'}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <FiShield className="text-[var(--color-primary-500)] mr-3" size={24} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Material</p>
                  <p className="font-semibold text-gray-900">{product.material || 'Standard'}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock === 0}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 font-medium"
                  >-</button>
                  <span className="px-4 py-3 font-bold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock === 0}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 font-medium"
                  >+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex justify-center items-center gap-2 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white px-8 py-3.5 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <FiShoppingCart size={20} />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">Customer Reviews</h2>
          {user && !showReviewForm && (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="bg-[var(--color-primary-50)] text-[var(--color-primary-600)] px-4 py-2 rounded-lg font-bold hover:bg-[var(--color-primary-100)] transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmit(onSubmitReview)} className="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Share your experience</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select {...register('rating')} required className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg">
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea {...register('comment')} required rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="What did you like about this toy?"></textarea>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[var(--color-primary-600)] text-white px-6 py-2 rounded-lg font-medium">Submit</button>
              <button type="button" onClick={() => setShowReviewForm(false)} className="bg-white border border-gray-300 px-6 py-2 rounded-lg font-medium">Cancel</button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this toy!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-300'} size={14} />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{review.user?.name || 'Anonymous User'}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
