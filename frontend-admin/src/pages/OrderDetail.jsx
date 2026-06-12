import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCreditCard, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import orderService from '../services/orderService';
import { toast } from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data.order);
    } catch (error) {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrder(); // Refresh to get updated timestamps
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <div className="py-20 text-center font-bold text-gray-500 animate-pulse">Loading Order Details...</div>;
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Order Not Found</h2>
        <Link to="/orders" className="text-blue-600 hover:underline font-bold">Return to Orders</Link>
      </div>
    );
  }

  // Helper to determine status color and icon
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'Delivered': return { color: 'bg-green-100 text-green-700', icon: <FiCheckCircle className="mr-1" /> };
      case 'Shipped': return { color: 'bg-blue-100 text-blue-700', icon: <FiTruck className="mr-1" /> };
      case 'Processing': return { color: 'bg-orange-100 text-orange-700', icon: <FiPackage className="mr-1" /> };
      case 'Confirmed': return { color: 'bg-indigo-100 text-indigo-700', icon: <FiCheckCircle className="mr-1" /> };
      case 'Cancelled': return { color: 'bg-red-100 text-red-700', icon: <FiXCircle className="mr-1" /> };
      default: return { color: 'bg-gray-100 text-gray-700', icon: <FiClock className="mr-1" /> }; // Pending
    }
  };

  const statusDisplay = getStatusDisplay(order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-6">
        <div>
          <Link to="/orders" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 mb-3 transition-colors">
            <FiArrowLeft className="mr-1.5" /> Back to Orders
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            Order Details
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider font-semibold">
            ID: {order._id}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-2">
            <span className="text-sm font-bold text-gray-500 mr-3">Update Status:</span>
            <select 
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm font-bold border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-colors border bg-white shadow-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${statusDisplay.color}`}>
            {statusDisplay.icon} {order.orderStatus}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <FiPackage className="mr-2 text-blue-600" /> Purchased Items
              </h2>
              <span className="text-sm font-bold text-gray-500">{order.totalItems} Items Total</span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start hover:bg-gray-50 transition-colors">
                  <div className="w-20 h-20 bg-white rounded-xl border border-gray-200 p-2 flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={item.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${item.image}` : 'https://via.placeholder.com/80'} 
                      alt={item.name} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                  <div className="flex-1 w-full flex flex-col sm:flex-row justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">Product ID: {item.product?._id || item.product}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <div className="text-sm text-gray-500 mb-1">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </div>
                      <div className="font-black text-gray-900 text-lg">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50/50 p-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="font-semibold text-gray-600">Shipping</span>
                <span className="font-bold text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total Paid</span>
                <span className="text-3xl font-black text-blue-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Customer</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xl border border-blue-200">
                {order.user?.name ? order.user.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <div>
                <p className="font-bold text-gray-900">{order.user?.name || 'Guest User'}</p>
                <p className="text-sm text-gray-500">{order.user?.email || 'No email provided'}</p>
              </div>
            </div>
            {order.user?.phone && (
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg text-center font-medium border border-gray-100">
                Contact: {order.user.phone}
              </p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-2">
              <FiMapPin className="mr-2 text-blue-600" /> Shipping Details
            </h3>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.country}</p>
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Phone Number</span>
                  <span className="font-semibold">{order.shippingAddress.mobile}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No shipping address provided.</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-2">
              <FiCreditCard className="mr-2 text-blue-600" /> Payment Info
            </h3>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <FiCreditCard className="text-gray-400" size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">{order.paymentMethod}</p>
                <p className="text-xs text-gray-500">To be collected</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500 font-medium">
              <div className="flex justify-between">
                <span>Ordered At:</span>
                <span className="text-gray-900">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              {order.deliveredAt && (
                <div className="flex justify-between">
                  <span>Delivered At:</span>
                  <span className="text-green-600">{new Date(order.deliveredAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
