import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-black text-[var(--color-primary-600)] tracking-tight mb-4 inline-block">
              ToyLand
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              The best and simple toy shop for kids of all ages. We bring joy and creativity right to your doorstep.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/products" className="hover:text-[var(--color-primary-500)] transition-colors">All Toys</Link></li>
              <li><Link to="/products?category=educational" className="hover:text-[var(--color-primary-500)] transition-colors">Educational</Link></li>
              <li><Link to="/products?category=outdoor" className="hover:text-[var(--color-primary-500)] transition-colors">Outdoor Play</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/faq" className="hover:text-[var(--color-primary-500)] transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-[var(--color-primary-500)] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-primary-500)] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ToyLand. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Designed with simplicity and joy.
          </p>
        </div>
      </div>
    </footer>
  );
}
