// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // store this on login

  if (!token || !user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // or a 403 page
  }

  return children;
};

export default ProtectedRoute;
