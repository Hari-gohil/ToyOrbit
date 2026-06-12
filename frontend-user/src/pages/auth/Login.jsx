import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-2xl shadow-sm border border-[var(--color-primary-100)] bg-white/50">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[var(--color-text-main)]">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Email address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] focus:z-10 sm:text-sm transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] focus:z-10 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] transition-all"
            >
              Sign In
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)]">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
