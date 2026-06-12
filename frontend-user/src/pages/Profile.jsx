import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';
import orderService from '../services/orderService';
import { FiUser, FiMapPin, FiPackage, FiLogOut, FiPlus, FiTrash2, FiNavigation } from 'react-icons/fi';
import Loader from '../components/Loader';

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [liveLocation, setLiveLocation] = useState(user?.liveLocation || null);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      try {
        // Reverse geocoding using Nominatim (OpenStreetMap) for granular details like building and area
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await response.json();
        
        let addressString = "Location not found";
        if (data && data.address) {
          const addr = data.address;
          const building = addr.building || addr.house_name || addr.amenity || '';
          const area = addr.neighbourhood || addr.suburb || addr.village || addr.road || '';
          const city = addr.city || addr.town || addr.county || '';
          const state = addr.state || '';
          
          const parts = [building, area, city, state].filter(part => part && part.trim() !== '');
          if (parts.length > 0) {
            addressString = parts.join(', ');
          }
        }
        
        const newLocation = { lat, lng, address: addressString };
        await userService.updateProfile({ liveLocation: newLocation });
        setLiveLocation(newLocation);
        toast.success('Live location updated successfully for deliveries!');
      } catch (error) {
        toast.error('Failed to save location');
      } finally {
        setLocationLoading(false);
      }
    }, () => {
      toast.error('Unable to retrieve your location. Please check browser permissions.');
      setLocationLoading(false);
    });
  };

  // Form for Personal Info
  const { register: registerInfo, handleSubmit: handleInfoSubmit, reset: resetInfo } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone }
  });

  // Form for Address
  const { register: registerAddress, handleSubmit: handleAddressSubmit, reset: resetAddress } = useForm();

  useEffect(() => {
    if (user) {
      resetInfo({ name: user.name, phone: user.phone });
      setAddresses(user.addresses || []);
    }
  }, [user, resetInfo]);

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          const data = await orderService.getMyOrders();
          setOrders(data.orders || []);
        } catch (error) {
          toast.error("Failed to load orders");
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const onUpdateInfo = async (data) => {
    try {
      const updatedData = { name: data.name, phone: data.phone };
      if (data.password) updatedData.password = data.password;
      
      const res = await userService.updateProfile(updatedData);
      toast.success("Profile updated successfully!");
      // reload or sync state ideally, but auth context handles user
      // For now, we trust it or let user refresh context manually if needed
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const onAddAddress = async (data) => {
    try {
      const newAddresses = [...addresses, data];
      await userService.updateProfile({ addresses: newAddresses });
      setAddresses(newAddresses);
      setShowAddressForm(false);
      resetAddress();
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const removeAddress = async (index) => {
    try {
      const newAddresses = addresses.filter((_, i) => i !== index);
      await userService.updateProfile({ addresses: newAddresses });
      setAddresses(newAddresses);
      toast.success("Address removed!");
    } catch (error) {
      toast.error("Failed to remove address");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:space-x-8">
        
        {/* Sidebar */}
        <div className="md:w-1/4 mb-8 md:mb-0">
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6 text-center border-b border-gray-100">
              <div className="h-20 w-20 mx-auto bg-[var(--color-primary-100)] text-[var(--color-primary-600)] rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            
            <nav className="p-2 space-y-1">
              <button 
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'info' ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FiUser className="mr-3 h-5 w-5" />
                Personal Info
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FiPackage className="mr-3 h-5 w-5" />
                My Orders
              </button>
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'addresses' ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FiMapPin className="mr-3 h-5 w-5" />
                Saved Addresses
              </button>
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button 
                  onClick={logout}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:w-3/4">
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 md:p-8 min-h-[400px]">
            
            {/* Personal Info Tab */}
            {activeTab === 'info' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Update Information</h3>
                <form onSubmit={handleInfoSubmit(onUpdateInfo)} className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" {...registerInfo('name')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="text" {...registerInfo('phone')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                    <input type="password" {...registerInfo('password')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]" />
                  </div>
                  <button type="submit" className="bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Save Changes
                  </button>
                </form>

                {/* Live Location Section */}
                <div className="mt-10 pt-8 border-t border-gray-100 max-w-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                    <FiNavigation className="mr-2 text-blue-500" /> Delivery Live Location
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Set your live location to help delivery partners find you easily. Works best when you are at the delivery address.
                  </p>
                  
                  {liveLocation && liveLocation.address && liveLocation.address !== "Location not found" ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Current Live Location</p>
                      <p className="text-sm text-blue-700 font-medium">{liveLocation.address}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4 text-center">
                      <p className="text-sm text-gray-500">No live location set yet.</p>
                    </div>
                  )}

                  <button 
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-white border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    {locationLoading ? (
                      <span className="flex items-center"><div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div> Locating...</span>
                    ) : (
                      <><FiNavigation className="mr-2" /> {liveLocation ? 'Update Live Location' : 'Set Live Location Now'}</>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>
                {loadingOrders ? (
                  <Loader />
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                      <FiPackage className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">When you buy toys, your orders will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order._id} className="border border-gray-100 rounded-xl p-6 bg-gray-50">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                          <div>
                            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                            <p className="font-semibold text-gray-900">Total: ${order.totalAmount}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-primary-100)] text-[var(--color-primary-600)]">
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="flex items-center text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)] text-sm font-medium">
                      <FiPlus className="mr-1" /> Add New
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleAddressSubmit(onAddAddress)} className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                        <input type="text" required {...registerAddress('fullName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Mobile</label>
                        <input type="text" required {...registerAddress('mobile')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700 mb-1">Address Line 1</label>
                        <input type="text" required {...registerAddress('addressLine1')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">City</label>
                        <input type="text" required {...registerAddress('city')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">State</label>
                        <input type="text" required {...registerAddress('state')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Pincode</label>
                        <input type="text" required {...registerAddress('pincode')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Country</label>
                        <input type="text" defaultValue="India" {...registerAddress('country')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="bg-[var(--color-primary-600)] text-white px-4 py-2 rounded-lg text-sm font-medium">Save Address</button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">Cancel</button>
                    </div>
                  </form>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                      <FiMapPin className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No saved addresses</h3>
                    <p className="mt-1 text-sm text-gray-500">Save a shipping address for faster checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-4 relative group">
                        <p className="font-semibold text-gray-900">{addr.fullName}</p>
                        <p className="text-sm text-gray-600 mt-1">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-sm text-gray-600">{addr.addressLine2}</p>}
                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.pincode}</p>
                        <p className="text-sm text-gray-600">{addr.country}</p>
                        <p className="text-sm text-gray-600 mt-2 font-medium">Phone: {addr.mobile}</p>
                        
                        <button 
                          onClick={() => removeAddress(idx)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
        
      </div>
    </div>
  );
}
