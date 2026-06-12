import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { user } = useAuth();

  if (!user?.wishlist?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 mb-6">
          <FiHeart className="text-red-300" size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Save items you love here and purchase them later. Start exploring our toys!
        </p>
        <Link 
          to="/products"
          className="inline-flex items-center bg-[var(--color-primary-600)] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[var(--color-primary-500)] transition-colors shadow-sm"
        >
          Explore Toys <FiArrowRight className="ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center mb-8">
        <FiHeart className="text-red-500 mr-3" size={32} />
        <h1 className="text-3xl font-black text-gray-900">My Wishlist</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {user.wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
