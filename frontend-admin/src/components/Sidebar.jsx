import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBox, FiShoppingCart, FiGrid, FiUsers, FiSettings, FiMessageSquare, FiCornerUpLeft } from 'react-icons/fi';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: FiHome },
    { name: 'Products', path: '/products', icon: FiBox },
    { name: 'Orders', path: '/orders', icon: FiShoppingCart },
    { name: 'Categories', path: '/categories', icon: FiGrid },
    { name: 'Users', path: '/users', icon: FiUsers },
    { name: 'Reviews', path: '/reviews', icon: FiMessageSquare },
    { name: 'Returns', path: '/returns', icon: FiCornerUpLeft },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 h-screen flex flex-col shadow-sm transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <FiBox className="text-white" size={18} />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">ToyLand <span className="text-blue-600 font-bold">Admin</span></span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-bold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium'
              }`}
            >
              <Icon 
                className={`mr-3 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} 
                size={20} 
              />
              {link.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/50">
          <p className="text-xs font-bold text-blue-800 mb-1">Store Status</p>
          <div className="flex items-center text-xs text-green-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Online & Active
          </div>
        </div>
      </div>
    </aside>
  );
}
