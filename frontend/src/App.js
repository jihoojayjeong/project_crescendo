import React from 'react';
import LoginPage from './pages/loginPage';
import FeedbackPage from './pages/Feedbackpage';
import Dashboard from './pages/Dashboard';
import GiveFeedback from './pages/GiveFeedback';
import Courses from './pages/Courses';
import CourseComponent from './components/CourseComponents';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const theme = createTheme({

});


function App() {
  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/FeedbackPage" element={<FeedbackPage />} />
      <Route path="/GiveFeedback" element={<GiveFeedback />} />
      <Route path="/course/:courseId" element={<CourseComponent />} />
      <Route path="/Courses" element={<Courses />} />
    </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
