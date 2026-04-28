import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, isAdminLoading } = useAdmin();
  const location = useLocation();

  console.log('Admin Security Guard Check:', { isAdminAuthenticated, isAdminLoading, path: location.pathname });

  // DEBUG: Track the guard status in the console
  console.log('🛡️ Admin Guard Status:', { 
    isAuthenticated: isAdminAuthenticated, 
    isLoading: isAdminLoading, 
    path: location.pathname 
  });

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
