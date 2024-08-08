import React, { useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { user } = useAuth();

  useEffect(() => {
    console.log('ProtectedRoute mounted', { user });
    return () => {
      console.log('ProtectedRoute unmounted');
    };
  }, [user]);

  return user ? <Component {...rest} /> : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
