import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
// import '/Users/macbook/Desktop/Research/project_crescendo/frontend/src/styles/Sidebar.css';
// import '/home/sangwonlee/project_cresendo/frontend/src/styles/Sidebar.css';
import './styles/sidebar.css'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
