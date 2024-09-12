import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, userRole, allowedRoles }) => {
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const loginPageUrl = isLocalEnv ? '/' : process.env.REACT_APP_CAS_LOGIN_URL;
  // if not authenticated, redirect to login page
  if (!isAuthenticated) {
    console.log('User not authenticated. Redirecting to:', loginPageUrl);
    return <Navigate to={loginPageUrl} replace />;
  }
  // if user role is not in allowed roles, redirect to the appropriate page
  if (!allowedRoles.includes(userRole)) {
    console.log(`User with role "${userRole}" is not allowed to access this page.`);
    return <Navigate to={userRole === 'student' ? '/Courses' : '/Dashboard'} replace />;
  }
  return <Outlet />; // render the component if all conditions are met
};

export default PrivateRoute;
