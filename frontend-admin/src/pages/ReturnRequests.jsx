import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiImage, FiPackage, FiUser, FiClock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import orderService from '../services/orderService';

export default function ReturnRequests() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Base URL for images
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/150';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllReturns();
      setReturns(data.returns || []);
    } catch (error) {
      toast.error("Failed to load return requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await orderService.updateReturnStatus(id, status);
      toast.success(`Return request ${status.toLowerCase()} successfully`);
      fetchReturns();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Return Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Manage user product return requests and approvals.</p>
        </div>
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm border border-red-100 shadow-sm">
          {returns.filter(r => r.returnRequest.status === 'Pending').length} Pending Requests
        </div>
      </div>

      {returns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <FiPackage className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Return Requests</h3>
          <p className="mt-1 text-sm text-gray-500">There are currently no return requests from users.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {returns.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 border-b border-gray-100 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order #{order._id.substring(order._id.length - 8)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.returnRequest.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        order.returnRequest.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.returnRequest.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <FiUser className="text-gray-400" /> {order.user?.name || 'Unknown User'} ({order.user?.email})
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <FiClock className="text-gray-400" /> Requested on {new Date(order.returnRequest.requestedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {order.returnRequest.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(order._id, 'Approved')}
                        className="flex items-center px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-bold hover:bg-green-100 transition-colors text-sm"
                      >
                        <FiCheck className="mr-2" /> Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(order._id, 'Rejected')}
                        className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition-colors text-sm"
                      >
                        <FiX className="mr-2" /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Reason & Items */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Reason for Return</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed">
                        {order.returnRequest.reason}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Order Items</h4>
                      <div className="space-y-3">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-xl">
                            <img src={getImageUrl(item.image)} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity} | ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Fault Image */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center uppercase tracking-wide">
                      <FiImage className="mr-2 text-gray-400" /> Fault Image
                    </h4>
                    {order.returnRequest.faultImage ? (
                      <div 
                        className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity relative group"
                        onClick={() => setSelectedImage(getImageUrl(order.returnRequest.faultImage))}
                      >
                        <img 
                          src={getImageUrl(order.returnRequest.faultImage)} 
                          alt="Fault proof" 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-bold text-sm">Click to enlarge</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl h-48 border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                        <FiImage size={32} className="mb-2 opacity-50" />
                        <span className="text-sm font-medium">No image provided</span>
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Enlarged fault proof" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <button 
            className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/80 p-2 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <FiX size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
