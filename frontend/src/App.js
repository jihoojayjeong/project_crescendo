import React from 'react';
import LoginPage from './pages/loginPage';
import FeedbackPage from './pages/Feedbackpage';
import Dashboard from './pages/Dashboard';
import GiveFeedback from './pages/GiveFeedback';
import ManageStudents from './pages/ManageStudents';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import CoursePage from './pages/CoursePage'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';


const CourseComponent = () => {
  const location = useLocation();
  const from = location.state?.from || '';
  if (from.startsWith('/Dashboard')) {
    return <CoursePage />;
  }
  else if(from.startsWith('/Courses')) {
    return <CourseDetails />;
  } 
  else{
    console.log("NOTHING RETURNED!")
  }
}
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
      <Route path="/ManageStudents" element={<ManageStudents />} />
      <Route path="/course/:courseId" element={<CourseComponent />} />
      <Route path="/Courses" element={<Courses />} />
    </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
