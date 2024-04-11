import FeedBackForm from './pages/FeedBackForm';
import LoginPage from './pages/loginPage';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/FeedbackForm" element={<FeedBackForm />} />
    </Routes>
    </BrowserRouter>
    {/* <LoginPage/> */}
    </React.StrictMode>
  );
}

export default App;
