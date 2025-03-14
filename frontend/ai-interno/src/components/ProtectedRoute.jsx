// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AutContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/user_login" replace />;
  }

  return children;  // Render the children if authenticated
};

export default ProtectedRoute;
