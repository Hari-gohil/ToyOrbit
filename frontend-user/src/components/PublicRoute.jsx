import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (user) {
    // If user is already logged in, they shouldn't see Login/Register
    return <Navigate to="/" replace />;
  }

  return children;
}
