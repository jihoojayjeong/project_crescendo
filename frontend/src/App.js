import React from 'react';
import LoginPage from './pages/loginPage';
import FeedbackPage from './pages/Feedbackpage';
import Dashboard from './pages/Dashboard';
import GiveFeedback from './pages/GiveFeedback';
import FacultyDashboard from './pages/FacultyDashboard';
import ManageStudents from './pages/ManageStudents';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import FacultySidebar from './components/FacultySidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/FeedbackPage" element={<FeedbackPage />} />
      <Route path="/GiveFeedback" element={<GiveFeedback />} />
      <Route path="/FacultyDashboard" element={<FacultyDashboard />} />
      <Route path="/ManageStudents" element={<ManageStudents />} />
      <Route path="/course/:courseId" element={<CourseDetails />} />
      <Route path="/Courses" element={<Courses />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
