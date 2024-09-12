import React, { useState, useEffect } from 'react';
import LoginPage from './pages/loginPage';
import FeedbackPage from './pages/Feedbackpage';
import Dashboard from './pages/Dashboard';
import GiveFeedback from './pages/GiveFeedback';
import axios from 'axios';
import PrivateRoute from './components/PrivateRoute';
import Courses from './pages/Courses';
import CourseComponent from './components/CourseComponents';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const theme = createTheme({});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/checkSession`, {
          withCredentials: true
        });
        setIsAuthenticated(response.data.isAuthenticated);
        setUserRole(response.data.user.role);
        console.log("User role is:", response.data.user.role);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['student', 'faculty']} />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/FeedbackPage" element={<FeedbackPage />} />
            <Route path="/GiveFeedback" element={<GiveFeedback />} />
            <Route path="/course/:courseId" element={<CourseComponent />} />
          </Route>
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['faculty']} />}>
            <Route path="/Courses" element={<Courses />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
