import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-max mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 mb-8">
          <FiAlertTriangle className="text-red-400" size={48} />
        </div>
        <main className="sm:flex">
          <p className="text-5xl font-black text-[var(--color-primary-600)] sm:text-6xl">404</p>
          <div className="sm:ml-6 sm:border-l sm:border-gray-200 sm:pl-6">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight sm:text-5xl">Page not found</h1>
            <p className="mt-3 text-base text-gray-500 max-w-sm">
              Please check the URL in the address bar and try again, or return back to shopping!
            </p>
          </div>
        </main>
        <div className="mt-10 flex justify-center space-x-3 sm:border-l sm:border-transparent sm:pl-6">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-3.5 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] transition-colors focus:outline-none"
          >
            <FiHome className="mr-2" size={18} /> Go back home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3.5 border border-transparent text-sm font-bold rounded-xl text-[var(--color-primary-700)] bg-[var(--color-primary-100)] hover:bg-[var(--color-primary-200)] transition-colors focus:outline-none"
          >
            Shop Toys
          </Link>
        </div>
      </div>
    </div>
  );
}
