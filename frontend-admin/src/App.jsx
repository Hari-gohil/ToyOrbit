import { AuthProvider } from './context/AuthContext';
import AdminRoutes from './routes/AdminRoutes';

export default function App() {
  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  );
}
