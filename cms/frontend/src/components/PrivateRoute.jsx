import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    // 1. Wait for Auth check to finish so we don't kick you out too early
    if (loading) {
        return <div className="p-5 text-center">Loading...</div>;
    }

    // 2. If not logged in at all, go to Login
    if (!user) {
        return <Navigate to="/" />;
    }

    // 3. If role is required (e.g. 'admin') and user doesn't match
    if (requiredRole && user.role !== requiredRole) {
        // Send them to their safe dashboard instead
        return <Navigate to="/dashboard" />;
    }

    // 4. Access Granted!
    return children;
};

export default PrivateRoute;