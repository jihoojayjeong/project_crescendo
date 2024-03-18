import FeedBackForm from "./components/FeedBackForm";
import FeedbackHistory from './components/FeedbackHistory';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <div className="App">
        <FeedBackForm/>
    </div>
  );
}

export default App;
