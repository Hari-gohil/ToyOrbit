import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiMail, FiUser, FiPhone } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Register() {
  const { register: registerAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Pass the secret to automatically make this user an admin
      await registerAdmin({ ...data, adminSecret: 'make-me-admin' });
      toast.success("Admin Account created successfully!");
      navigate('/');
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 animate-fade-in">
        <div>
          <h2 className="mt-6 text-center text-3xl font-black text-white tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Create a new administrator account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('name')}
                type="text"
                required
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Full Name"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('email')}
                type="email"
                required
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Admin Email Address"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('phone')}
                type="tel"
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Phone Number (Optional)"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('password')}
                type="password"
                required
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-800 transition-colors shadow-sm"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-400 mt-4">
            Already have an account? <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
