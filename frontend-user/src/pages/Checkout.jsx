import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiCreditCard, FiTruck, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';
import orderService from '../services/orderService';
import { toast } from 'react-hot-toast';

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue } = useForm();

  // Redirect if empty cart
  useEffect(() => {
    if (!cart?.items?.length) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Pre-fill form with default address if available
  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setValue('fullName', defaultAddress.fullName);
      setValue('mobile', defaultAddress.mobile);
      setValue('addressLine1', defaultAddress.addressLine1);
      setValue('addressLine2', defaultAddress.addressLine2 || '');
      setValue('city', defaultAddress.city);
      setValue('state', defaultAddress.state);
      setValue('pincode', defaultAddress.pincode);
      setValue('country', defaultAddress.country || 'India');
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await orderService.createOrder({ shippingAddress: data });
      toast.success("Order Placed Successfully!");
      await fetchCart(); // Refresh cart to show it's empty
      navigate(`/order/${res.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in bg-gray-50/30">
      <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center">
        <FiCheckCircle className="mr-3 text-[var(--color-primary-500)]" /> Secure Checkout
      </h1>

      <div className="lg:flex lg:gap-12">
        {/* Checkout Form */}
        <div className="lg:w-2/3 mb-8 lg:mb-0">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center">
                <FiMapPin className="text-gray-500 mr-2" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Shipping Information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input {...register('fullName')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <input {...register('mobile')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 1</label>
                  <input {...register('addressLine1')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 2 (Optional)</label>
                  <input {...register('addressLine2')} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input {...register('city')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <input {...register('state')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode / ZIP</label>
                  <input {...register('pincode')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                  <input {...register('country')} required defaultValue="India" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] transition-colors" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center">
                <FiCreditCard className="text-gray-500 mr-2" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center p-4 border border-[var(--color-primary-500)] bg-[var(--color-primary-50)] rounded-xl relative">
                  <input type="radio" checked readOnly className="w-5 h-5 text-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)] border-gray-300" />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">Cash on Delivery (COD)</span>
                    <span className="block text-xs text-gray-500">Pay when you receive the order at your doorstep.</span>
                  </div>
                  <FiTruck className="absolute right-6 text-[var(--color-primary-400)]" size={32} />
                </div>
              </div>
            </div>
            
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="divide-y divide-gray-100 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.items.map(item => (
                <div key={item._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center max-w-[70%]">
                    <span className="text-sm font-semibold text-gray-600 mr-2">{item.quantity}x</span>
                    <span className="text-sm text-gray-900 truncate">{item.product?.name || 'Toy Item'}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cart.totalItems} items)</span>
                <span className="font-semibold text-gray-900">₹{cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-8 flex justify-between items-end">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-black text-[var(--color-primary-600)]">₹{cart.totalPrice.toFixed(2)}</span>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full flex justify-center items-center bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-bold transition-colors shadow-sm text-lg"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            <p className="mt-4 text-xs text-center text-gray-400">
              By placing your order, you agree to our terms and policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
