import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ isAuthenticated, userRole, allowedRoles }) => {
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const loginPageUrl = isLocalEnv ? '/' : process.env.REACT_APP_CAS_LOGIN_URL;

  if (!isAuthenticated) {
    alert('Please log in to access this page.');
    return <Navigate to={loginPageUrl} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    alert(`Access denied. Redirecting to ${userRole === 'student' ? 'Dashboard' : 'Courses'} page.`);
    return <Navigate to={userRole === 'professor' ? '/Courses' : '/Dashboard'} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
