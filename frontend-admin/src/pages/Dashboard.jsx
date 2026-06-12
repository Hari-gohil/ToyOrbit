import { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiActivity } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { toast } from 'react-hot-toast';
import dashboardService from '../services/dashboardService';
import { Link } from 'react-router-dom';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const result = await dashboardService.getDashboardStats();
        setData(result);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { stats, orderStatusStats, recentOrders } = data;

  const statCards = [
    { name: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: FiDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { name: 'Total Orders', value: stats.totalOrders || 0, icon: FiShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { name: 'Active Users', value: stats.totalUsers || 0, icon: FiUsers, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { name: 'Return Requests', value: stats.totalReturns || 0, icon: FiBox, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  ];

  // Format data for Recharts
  const chartData = orderStatusStats.map(item => ({
    name: item._id,
    value: item.count
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome to your ToyLand control center.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
              <div className="relative flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">{stat.name}</p>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ${stat.border} border`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
            <FiActivity className="mr-2 text-blue-500" /> Order Status Distribution
          </h2>
          <div className="flex-1 w-full relative">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 font-medium">
                No order data available to chart.
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h2 className="text-lg font-bold text-gray-900">Latest Orders</h2>
            <Link to="/orders" className="text-xs font-bold text-blue-600 hover:text-blue-800">View All</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <div key={order._id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-500 truncate pr-2">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-800 text-sm truncate">
                    {order.user?.name || 'Unknown User'}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="font-black text-blue-600 text-sm">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 text-sm text-center">
                No orders have been placed yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
