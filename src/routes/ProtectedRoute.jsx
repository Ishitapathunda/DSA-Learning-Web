import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any route element with this to require a logged-in session.
// Redirects to /login (preserving the intended destination) if not
// authenticated, and shows a lightweight loading state while the
// initial session check (GET /api/auth/me) is in flight.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkingSession } = useAuth();
  const location = useLocation();

  if (checkingSession) {
    return (
      <div className="page-container">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
