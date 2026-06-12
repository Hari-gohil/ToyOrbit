import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, loading, removeFromCart, updateCartItem } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity, currentStock) => {
    if (newQuantity < 1) return;
    if (newQuantity > currentStock) return;
    updateCartItem(productId, newQuantity);
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading cart...</div>;
  }

  if (!cart?.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-50 mb-6">
          <FiShoppingBag className="text-gray-300" size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added any toys to your cart yet. Discover some amazing toys in our shop!
        </p>
        <Link 
          to="/products"
          className="inline-flex items-center bg-[var(--color-primary-600)] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[var(--color-primary-500)] transition-colors shadow-sm"
        >
          Start Shopping <FiArrowRight className="ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>

      <div className="lg:flex lg:gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3 mb-8 lg:mb-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Items in your cart ({cart.totalItems})</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {cart.items.map((item, index) => {
                const productId = item.product?._id || item.product;
                const productName = item.product?.name || 'Unknown Product';
                const productStock = item.product?.stock || 0;
                const productDiscount = item.product?.discountPrice || 0;
                
                const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');
                const imgSrc = item.product?.images?.[0]?.startsWith('/uploads') 
                  ? `${backendUrl}${item.product.images[0]}` 
                  : (item.product?.images?.[0] || 'https://via.placeholder.com/150');

                return (
                <div key={item._id || index} className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start relative group">
                  
                  {/* Product Image */}
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl p-2 border border-gray-100 flex items-center justify-center overflow-hidden text-gray-400 text-xs text-center">
                    {item.product?.images?.[0] ? (
                      <img 
                        src={imgSrc} 
                        alt={productName} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      "No Image"
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                    <div className="mb-4 sm:mb-0 sm:pr-8">
                      <Link to={`/product/${productId}`} className="text-lg font-bold text-gray-900 hover:text-[var(--color-primary-600)] transition-colors">
                        {productName}
                      </Link>
                      
                      <div className="mt-2 text-gray-900 font-black">
                        ₹{item.price}
                        {productDiscount > 0 && item.price === productDiscount && (
                          <span className="ml-2 text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Sale Price</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white mb-4">
                        <button 
                          onClick={() => handleQuantityChange(productId, item.quantity - 1, productStock)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >-</button>
                        <span className="px-4 py-1.5 font-bold text-sm min-w-[2.5rem] text-center border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(productId, item.quantity + 1, productStock)}
                          disabled={item.quantity >= productStock}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >+</button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(productId)}
                        className="flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                  
                </div>
              )})}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.totalItems} items)</span>
                <span className="font-semibold text-gray-900">₹{cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-gray-900">₹{cart.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full flex justify-center items-center bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white px-6 py-4 rounded-xl font-bold transition-colors shadow-sm"
            >
              Proceed to Checkout
            </button>
            
            <Link 
              to="/products"
              className="mt-4 w-full flex justify-center text-sm font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
