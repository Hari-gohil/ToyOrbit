import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || ''
      });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-2xl shadow-sm border border-[var(--color-primary-100)] bg-white/50">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[var(--color-text-main)]">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
            Join our toy shop community
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Full Name</label>
              <input
                type="text"
                {...register("name", { 
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] focus:z-10 sm:text-sm transition-colors"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Email address</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] focus:z-10 sm:text-sm transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                {...register("phone")}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] focus:z-10 sm:text-sm transition-colors"
                placeholder="+1 234 567 890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Password</label>
              <input
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
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
              Create Account
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)]">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
