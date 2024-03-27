import FeedBackForm from './pages/FeedBackForm';
import LoginPage from './pages/loginPage';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <LoginPage/>
    </div>
  );
}

export default App;
