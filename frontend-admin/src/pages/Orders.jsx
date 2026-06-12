import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FiShoppingBag, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiEye } from 'react-icons/fi';
import orderService from '../services/orderService';
import { toast } from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      // Backend already sorts by createdAt: -1, so recent orders are at the top!
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh the data to reflect changes
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Helper to determine status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Processing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Confirmed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200'; // Pending
    }
  };

  const columns = [
    {
      name: 'Order ID / Date',
      selector: row => row._id,
      sortable: true,
      cell: row => (
        <div className="py-3">
          <div className="font-bold text-gray-900 text-xs tracking-wider uppercase">{row._id.substring(row._id.length - 8)}</div>
          <div className="text-sm text-gray-500 mt-1">{new Date(row.createdAt).toLocaleDateString()} {new Date(row.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
      ),
      minWidth: '180px'
    },
    {
      name: 'Customer Info',
      selector: row => row.user?.name,
      sortable: true,
      cell: row => (
        <div className="flex items-start gap-3 py-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex flex-shrink-0 items-center justify-center font-black text-sm border border-blue-200">
            {row.user?.name ? row.user.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <div>
            <div className="font-bold text-gray-900 leading-tight">{row.user?.name || 'Guest User'}</div>
            <div className="text-xs text-gray-500 mt-0.5">{row.user?.email || 'N/A'}</div>
            {row.shippingAddress && (
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="font-semibold">{row.shippingAddress.mobile}</div>
                <div>{row.shippingAddress.addressLine1}</div>
                <div className="text-gray-400">{row.shippingAddress.city}, {row.shippingAddress.state} {row.shippingAddress.pincode}</div>
              </div>
            )}
          </div>
        </div>
      ),
      minWidth: '280px',
      wrap: true
    },
    {
      name: 'Total Items',
      selector: row => row.totalItems,
      sortable: true,
      center: true,
      minWidth: '100px'
    },
    {
      name: 'Total Amount',
      selector: row => row.totalAmount,
      sortable: true,
      cell: row => <div className="font-black text-blue-600">₹{row.totalAmount.toFixed(2)}</div>,
      minWidth: '120px'
    },
    {
      name: 'Live Status',
      selector: row => row.orderStatus,
      sortable: true,
      cell: row => (
        <select 
          value={row.orderStatus}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`px-3 py-1.5 rounded-xl text-sm font-bold border focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${getStatusColor(row.orderStatus)}`}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      ),
      minWidth: '160px'
    },
    {
      name: 'Actions',
      cell: row => (
        <Link 
          to={`/orders/${row._id}`}
          className="flex items-center justify-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-200"
          title="View Details"
        >
          <FiEye className="mr-1.5" /> Details
        </Link>
      ),
      minWidth: '110px'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
            <FiShoppingBag className="mr-2 text-blue-600" /> Live Orders Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitor recent orders and update their delivery status.</p>
        </div>
        
        {/* Quick Stats Summary */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center">
            <FiClock className="text-orange-500 mr-2" />
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Pending</div>
              <div className="font-black text-gray-900">{orders.filter(o => o.orderStatus === 'Pending').length}</div>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center">
            <FiTruck className="text-blue-500 mr-2" />
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Shipped</div>
              <div className="font-black text-gray-900">{orders.filter(o => o.orderStatus === 'Shipped').length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={orders}
          progressPending={loading}
          pagination
          responsive
          highlightOnHover
          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#f8fafc',
                borderBottomColor: '#f1f5f9',
                fontWeight: 'bold',
                color: '#475569',
              },
            },
            rows: {
              style: {
                minHeight: '120px', // increased for detailed customer info card
              },
            },
          }}
        />
      </div>
    </div>
  );
}
