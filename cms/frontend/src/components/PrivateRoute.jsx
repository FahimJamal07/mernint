import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'; 

const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        alert(`Access Denied! Required role: ${requiredRole}. Your role: ${role}.`);
        return <Navigate to="/dashboard" replace />; 
    }

    return children;
};

export default PrivateRoute;