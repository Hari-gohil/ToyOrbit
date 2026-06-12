import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FiUsers, FiMapPin, FiShoppingBag, FiStar, FiActivity } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import userService from '../services/userService';

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      // Filter out admins if you only want to see customers, or keep them all.
      // We will show everyone, but indicate their role.
      setUsers(data.users || []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await userService.updateUserStatus(id, !currentStatus);
      toast.success(`User is now ${!currentStatus ? 'Active' : 'Inactive'}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const columns = [
    {
      name: 'Customer Info',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <div className="flex items-start gap-3 py-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex flex-shrink-0 items-center justify-center font-black text-sm border border-indigo-200">
            {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="font-bold text-gray-900 leading-tight">
              {row.name} {row.role === 'admin' && <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase font-black tracking-wider">Admin</span>}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{row.email}</div>
            <div className="text-xs text-gray-500 font-medium">{row.phone || 'No phone'}</div>
          </div>
        </div>
      ),
      minWidth: '240px',
      wrap: true
    },
    {
      name: 'Address Info',
      cell: row => {
        const address = row.addresses?.find(a => a.isDefault) || row.addresses?.[0];
        return address ? (
          <div className="py-3 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 w-full my-2">
            <div className="font-semibold text-gray-800">{address.fullName} <span className="text-gray-500 font-normal">({address.mobile})</span></div>
            <div className="mt-1">{address.addressLine1}</div>
            {address.addressLine2 && <div>{address.addressLine2}</div>}
            <div className="text-gray-500">{address.city}, {address.state} {address.pincode}</div>
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic bg-gray-50/50 p-2 rounded border border-gray-100 border-dashed">No address provided</div>
        );
      },
      minWidth: '260px',
      wrap: true
    },
    {
      name: 'Order Info',
      selector: row => row.orderCount,
      sortable: true,
      cell: row => (
        <div className="flex flex-col">
          <div className="flex items-center text-sm font-bold text-gray-900">
            <FiShoppingBag className="mr-1.5 text-blue-500" /> {row.orderCount || 0} Orders
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium">
            Total Spent: <span className="font-bold text-blue-600">₹{(row.totalSpent || 0).toFixed(2)}</span>
          </div>
        </div>
      ),
      minWidth: '150px'
    },
    {
      name: 'Reviews',
      selector: row => row.reviewCount,
      sortable: true,
      center: true,
      cell: row => (
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center text-sm font-bold text-gray-900 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
            <FiStar className="mr-1 text-orange-400" /> {row.reviewCount || 0}
          </div>
        </div>
      ),
      minWidth: '100px'
    },
    {
      name: 'Account Status',
      selector: row => row.isActive,
      sortable: true,
      cell: row => (
        <button 
          onClick={() => handleStatusToggle(row._id, row.isActive)}
          className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            row.isActive 
              ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
              : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
          }`}
          title="Click to toggle status"
        >
          <FiActivity className="mr-1.5" /> {row.isActive ? 'Active' : 'Inactive'}
        </button>
      ),
      minWidth: '140px'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
            <FiUsers className="mr-2 text-blue-600" /> Customers Directory
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage users, view their order history, and account status.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center">
            <FiUsers className="text-indigo-500 mr-2" />
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Total Users</div>
              <div className="font-black text-gray-900">{users.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={users}
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
                minHeight: '100px', // accommodates taller address cards
              },
            },
          }}
        />
      </div>
    </div>
  );
}
