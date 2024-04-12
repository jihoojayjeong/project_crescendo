import FeedBackForm from './pages/FeedBackForm';
import LoginPage from './pages/loginPage';
import FeedbackPage from './pages/Feedbackpage';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/FeedbackForm" element={<FeedBackForm />} />
      <Route path="/FeedbackPage" element={<FeedbackPage />} />
    </Routes>
    </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
