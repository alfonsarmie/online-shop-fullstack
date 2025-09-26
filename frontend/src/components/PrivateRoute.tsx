import { Navigate } from 'react-router-dom';
import React from 'react';
import { User } from '../types/user';

interface PrivateRouteProps {
  user: User | null;
  requiredRole?: string;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ user, requiredRole, children }) => {
  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    // Does not have the required role, redirect to home
    return <Navigate to="/" replace />;
  }
  // User is authenticated and has the correct role
  return children;
};

export default PrivateRoute;
