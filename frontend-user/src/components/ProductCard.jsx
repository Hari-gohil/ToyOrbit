import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/pagination';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error('Product is out of stock!');
    }
  };

  const defaultImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24px" fill="%239ca3af">No Image</text></svg>';
  const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');
  const images = product?.images?.length > 0 
    ? product.images.map(img => img.startsWith('/uploads') ? `${backendUrl}${img}` : img) 
    : [defaultImage];

  const { user, toggleWishlist } = useAuth();
  const isWishlisted = user?.wishlist?.some(w => (w._id || w) === product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to wishlist items");
      return;
    }
    const added = await toggleWishlist(product);
    if (added) toast.success("Added to Wishlist");
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      
      {/* Badges */}
      {product.discountPrice > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          Sale
        </div>
      )}
      {product.stock === 0 && (
        <div className="absolute top-3 right-3 z-10 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md">
          Out of Stock
        </div>
      )}

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all group/btn"
        style={{ right: product.stock === 0 ? '5rem' : '0.75rem' }}
      >
        <FiHeart 
          size={18} 
          className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/btn:text-red-500'}`} 
        />
      </button>

      {/* Image Slider */}
      <Link to={`/product/${product._id}`} className="block relative w-full h-56 bg-gray-50">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img 
                src={img} 
                alt={`${product.name} - ${idx + 1}`} 
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product._id}`} className="hover:text-[var(--color-primary-600)] transition-colors">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center space-x-1 mb-3">
          <FiStar className="text-yellow-400 fill-current" size={14} />
          <span className="text-sm font-medium text-gray-700">{product.averageRating || '0'}</span>
          <span className="text-xs text-gray-400">({product.totalReviews || 0} reviews)</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-1 rounded-full">
            {product.ageGroup}
          </span>
          {product.category?.name && (
            <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            {product.discountPrice > 0 ? (
              <div className="flex flex-col">
                <span className="text-lg font-black text-gray-900">₹{product.discountPrice}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
              </div>
            ) : (
              <span className="text-lg font-black text-gray-900">₹{product.price}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl transition-all ${
              product.stock > 0 
                ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] hover:bg-[var(--color-primary-600)] hover:text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title="Add to Cart"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
