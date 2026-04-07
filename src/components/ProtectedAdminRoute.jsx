import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { PageLoader } from './PageFeedback';

const ProtectedAdminRoute = () => {
  const { bootstrapped, isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!bootstrapped) {
    return (
      <main className="page-shell px-4 py-28 md:px-8">
        <div className="mx-auto max-w-xl">
          <PageLoader title="Checking admin access" subtitle="Restoring the last admin session if it is still active." />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
