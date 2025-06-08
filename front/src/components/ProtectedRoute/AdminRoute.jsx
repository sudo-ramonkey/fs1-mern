import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../../redux/slices/authSlice';

const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to auth page with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!user || user.role !== 'Admin') {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
