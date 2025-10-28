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
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;
