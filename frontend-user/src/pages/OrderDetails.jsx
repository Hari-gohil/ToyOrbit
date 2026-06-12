import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiMapPin, FiTruck, FiCreditCard, FiStar } from 'react-icons/fi';
import orderService from '../services/orderService';
import reviewService from '../services/reviewService';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewingItem, setReviewingItem] = useState(null); // stores productId to review

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data.order);
      } catch (error) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const onSubmitReview = async (data) => {
    try {
      const reviewData = {
        product: reviewingItem,
        rating: Number(data.rating),
        comment: data.comment
      };
      await reviewService.createReview(reviewData);
      toast.success("Review submitted successfully!");
      setReviewingItem(null);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/96';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) return <div className="py-20"><Loader /></div>;
  if (!order) return <div className="py-20 text-center">Order not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to="/orders" className="flex items-center text-gray-500 hover:text-[var(--color-primary-600)] mb-8 transition-colors font-medium">
        <FiArrowLeft className="mr-2" /> Back to My Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Details</h1>
          <p className="text-gray-500 mt-1">Order ID: <span className="font-semibold text-gray-900">{order._id}</span></p>
        </div>
        <div className="text-left md:text-right flex flex-col items-start md:items-end gap-2">
          <p className="text-sm text-gray-500 mb-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          <div className="flex flex-wrap items-center gap-3">
            {order.returnRequest?.isRequested ? (
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
                order.returnRequest.status === 'Approved' ? 'bg-green-100 text-green-700' :
                order.returnRequest.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                Return: {order.returnRequest.status}
              </span>
            ) : order.orderStatus === 'Delivered' && (
              (() => {
                const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt);
                const diffDays = Math.ceil(Math.abs(new Date() - deliveryDate) / (1000 * 60 * 60 * 24));
                if (diffDays <= 5) {
                  return (
                    <Link to={`/order/${order._id}/return`} className="inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors">
                      Request Return
                    </Link>
                  );
                }
                return null;
              })()
            )}
            
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
              order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {order.orderStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Items Ordered ({order.totalItems})</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item) => {
                const productId = item.product?._id || item.product;
                return (
                <div key={item._id} className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-100 p-2 flex-shrink-0">
                      <img 
                        src={getImageUrl(item.image || item.product?.images?.[0])} 
                        alt={item.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {productId ? (
                          <Link to={`/product/${productId}`} className="text-lg font-bold text-gray-900 hover:text-[var(--color-primary-600)] transition-colors">
                            {item.name}
                          </Link>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">{item.name} (Product Unavailable)</span>
                        )}
                        <p className="text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-black text-gray-900">₹{item.price.toFixed(2)}</span>
                        
                        {order.orderStatus === 'Delivered' && productId && reviewingItem !== productId && (
                          <button 
                            onClick={() => setReviewingItem(productId)}
                            className="text-sm font-bold text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)] flex items-center"
                          >
                            <FiStar className="mr-1" /> Review Item
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inline Review Form for this item */}
                  {reviewingItem === productId && productId && (
                    <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-4">Write a review for {item.name}</h4>
                      <form onSubmit={handleSubmit(onSubmitReview)}>
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
                          <textarea {...register('comment')} required rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Tell us what you thought!"></textarea>
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" className="bg-[var(--color-primary-600)] text-white px-6 py-2 rounded-lg font-medium shadow-sm">Submit Review</button>
                          <button type="button" onClick={() => { setReviewingItem(null); reset(); }} className="bg-white border border-gray-300 px-6 py-2 rounded-lg font-medium">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Info */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-[var(--color-primary-600)]">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FiMapPin className="mr-2 text-[var(--color-primary-500)]" /> Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">Phone: {order.shippingAddress.mobile}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No shipping address provided.</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FiCreditCard className="mr-2 text-[var(--color-primary-500)]" /> Payment Method
            </h3>
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
              <p className="mt-1">Payment is collected upon delivery.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
