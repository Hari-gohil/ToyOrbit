import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiHeart } from 'react-icons/fi';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl font-black text-[var(--color-primary-600)] tracking-tight">ToyLand</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-[var(--color-primary-500)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/orders" className="text-gray-600 hover:text-[var(--color-primary-500)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Orders
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-[var(--color-primary-500)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Shop Toys
            </Link>

            <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
              {user && (
                <Link to="/wishlist" className="text-gray-600 hover:text-[var(--color-primary-500)] relative p-2">
                  <FiHeart size={22} />
                  {user.wishlist?.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                      {user.wishlist.length}
                    </span>
                  )}
                </Link>
              )}

              <Link to="/cart" className="text-gray-600 hover:text-[var(--color-primary-500)] relative p-2">
                <FiShoppingCart size={22} />
                {cart?.totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cart.totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative flex items-center gap-4">
                  <Link to="/profile" className="text-gray-600 hover:text-[var(--color-primary-500)] p-2">
                    <FiUser size={22} />
                  </Link>
                  <button onClick={logout} className="text-gray-600 hover:text-red-500 p-2" title="Logout">
                    <FiLogOut size={22} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden gap-4">
            {user && (
              <Link to="/wishlist" className="text-gray-600 relative p-2">
                <FiHeart size={22} />
                {user.wishlist?.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {user.wishlist.length}
                  </span>
                )}
              </Link>
            )}
            
            <Link to="/cart" className="text-gray-600 relative p-2">
              <FiShoppingCart size={22} />
              {cart?.totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cart.totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[var(--color-primary-500)] hover:bg-gray-50">
              Home
            </Link>
            <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[var(--color-primary-500)] hover:bg-gray-50">
              Shop Toys
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[var(--color-primary-500)] hover:bg-gray-50">
                  Profile
                </Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-primary-600)] hover:bg-gray-50">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
