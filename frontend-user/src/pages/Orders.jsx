import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
import orderService from '../services/orderService';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data.orders || []);
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="py-20"><Loader /></div>;

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-50 mb-6">
          <FiPackage className="text-gray-300" size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          You haven't placed any orders. Start browsing our amazing toy collection!
        </p>
        <Link 
          to="/products"
          className="inline-flex items-center bg-[var(--color-primary-600)] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[var(--color-primary-500)] transition-colors shadow-sm"
        >
          Shop Toys <FiArrowRight className="ml-2" />
        </Link>
      </div>
    );
  }

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/64';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-black text-gray-900 mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Order ID</p>
                <p className="text-gray-900 font-bold">{order._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Date</p>
                <p className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total</p>
                <p className="text-gray-900 font-black">${order.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                  order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                {order.orderItems.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 p-1">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                ))}
                {order.orderItems.length > 4 && (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center font-bold text-gray-500">
                    +{order.orderItems.length - 4}
                  </div>
                )}
              </div>
              
              <Link 
                to={`/order/${order._id}`}
                className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)] font-bold text-sm inline-flex items-center transition-colors"
              >
                View Order Details <FiArrowRight className="ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
