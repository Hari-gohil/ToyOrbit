import { useContext } from 'react';
import { FiBell, FiSearch, FiLogOut, FiMenu } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 text-gray-500 hover:text-blue-600 mr-2"
        >
          <FiMenu size={24} />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500 font-medium">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white group-hover:ring-blue-200 transition-all">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </Link>
          <div className="h-8 w-px bg-gray-200 mx-1"></div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
