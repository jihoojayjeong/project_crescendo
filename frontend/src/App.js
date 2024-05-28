import LoginPage from './pages/loginPage';
import FeedbackPage from './pages/Feedbackpage';
import Dashboard from './pages/Dashboard';
import GiveFeedback from './pages/GiveFeedback';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/FeedbackPage" element={<FeedbackPage />} />
      <Route path="/GiveFeedback" element={<GiveFeedback />} />
      
    </Routes>
    </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
