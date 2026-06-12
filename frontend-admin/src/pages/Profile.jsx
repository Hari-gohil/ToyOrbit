import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

export default function Profile() {
  const { user, login } = useContext(AuthContext); // Re-login updates the context
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const data = await authService.getProfile();
        setValue('name', data.user.name);
        setValue('email', data.user.email);
        setValue('phone', data.user.phone || '');
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const updateData = {
        name: data.name,
        phone: data.phone,
      };
      if (data.password) {
        if (data.password !== data.confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        updateData.password = data.password;
      }

      const res = await authService.updateProfile(updateData);
      
      // Update local storage and context through login-like function
      // Actually we can just reload or update context manually, but authService.updateProfile updates localStorage.
      // So we can just show a toast and force a reload if context doesn't update automatically.
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
            <FiShield className="mr-2 text-blue-600" /> Admin Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your administrator account details and credentials.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-100">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-4xl shadow-md ring-4 ring-blue-50">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">{user?.name || 'Administrator'}</h2>
              <div className="flex items-center mt-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                  Admin Role
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('name', { required: true })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                    placeholder="Admin Name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address (Read Only)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FiLock className="mr-2 text-blue-500" /> Update Password
              </h3>
              <p className="text-sm text-gray-500 mb-6 -mt-4">Leave blank if you don't want to change your password.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    {...register('password')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    {...register('confirmPassword')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Updating...</span>
                ) : (
                  <><FiSave className="mr-2" /> Save Changes</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
