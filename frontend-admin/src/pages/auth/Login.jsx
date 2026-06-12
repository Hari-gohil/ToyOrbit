import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiMail } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toast.success("Welcome back, Admin!");
      navigate('/');
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/10 z-10">
        <div>
          <h2 className="mt-2 text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-3 text-center text-sm text-gray-300 font-medium">
            Sign in to manage your store
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-400">
                <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                {...register('email')}
                type="email"
                required
                className="appearance-none block w-full pl-12 px-4 py-4 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/10 transition-all duration-300"
                placeholder="Admin Email Address"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-400">
                <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                {...register('password')}
                type="password"
                required
                className="appearance-none block w-full pl-12 px-4 py-4 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/10 transition-all duration-300"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-70 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-400 mt-6">
            Need an admin account? <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
