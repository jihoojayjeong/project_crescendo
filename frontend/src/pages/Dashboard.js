import React, { useState } from 'react';
// import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => (
    <div style={{
        width: isOpen ? '250px' : '80px',
        transition: 'width 0.3s',
        backgroundColor: '#800000',
        height: '100vh',
        position: 'fixed',
        color: 'white',
        padding: '1rem',
        overflow: 'hidden',
        zIndex: 1000 // 추가
    }}>
        <div onClick={toggleSidebar} style={{ cursor: 'pointer', marginBottom: '2rem', display: 'block', visibility: 'visible', position: 'relative' }}>
            <i className="fas fa-bars" style={{ fontSize: '1.5rem', color: 'white' }}></i>
        </div>
        {isOpen && (
            <>
                <div style={{ textAlign: 'center' }}>
                    <img src="profile_picture_url" alt="Profile" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                    <h3>Jihoo Jeong</h3>
                    <p>Group 6</p>
                </div>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Button variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Dashboard</Button>
                    <Button variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Teams</Button>
                    <Button variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Settings</Button>
                </div>
                <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                    <Button variant="secondary" style={{ backgroundColor: '#6a5acd', width: '100%' }}>Create Teams</Button>
                    <Button variant="danger" style={{ marginTop: '1rem', width: '100%' }}>Sign Out</Button>
                </div>
            </>
        )}
    </div>
);

const Card = ({ children, header }) => (
    <div className="card" style={{ borderRadius: '1rem', backgroundColor: '#ffe4e1', border: '1px solid #ccc', margin: '1rem 0' }}>
        <div className="card-header" style={{ backgroundColor: '#f08080', color: 'white', borderRadius: '1rem 1rem 0 0', padding: '1rem' }}>
            <h3 className="mb-0">{header}</h3>
        </div>
        <div className="card-body p-5 text-center">
            {children}
        </div>
    </div>
);

const Container = ({ children }) => (
    <div style={{ display: 'flex' }}>
        {children}
    </div>
);

const MainContent = ({ children, isSidebarOpen }) => (
    <div style={{
        marginLeft: isSidebarOpen ? '250px' : '80px',
        padding: '2rem',
        width: '100%',
        transition: 'margin-left 0.3s'
    }}>
        {children}
    </div>
);

// const TextInput = ({ id, label, onChange, value }) => (
//     <div className="form-outline mb-4">
//         <label className="form-label" htmlFor={id}>{label}</label>
//         <input type="text" id={id} className="form-control" onChange={onChange} value={value} style={{ marginBottom: '1rem', padding: '0.5rem' }} />
//     </div>
// );

// const TextArea = ({ id, label, onChange, value }) => (
//     <div className="form-outline mb-4">
//         <label className="form-label" htmlFor={id}>{label}</label>
//         <textarea className="form-control" id={id} rows="4" onChange={onChange} value={value} style={{ marginBottom: '1rem', padding: '0.5rem' }}></textarea>
//     </div>
// );

// const SubmitButton = ({ onClick }) => (
//     <button className="btn btn-lg btn-block m-3" type="submit" onClick={onClick} style={{ backgroundColor: '#6a5acd', color: 'white', border: 'none' }}>Submit</button>
// );


const Dashboard = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        console.log("Sidebar toggled");
        setSidebarOpen(!isSidebarOpen);
    };

    const handleGiveFeedback = (event) => {
        event.preventDefault();
          navigate('/Givefeedback');
    };

    return (
        <div>
            <ToastContainer />
            <Container>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <MainContent isSidebarOpen={isSidebarOpen}>
                    <h1>Dashboard</h1>
                    <Card header="Student Group 1">
                        <p>Jaison Dasika, Kristian Braun, Jihoo Jeong, Somin Yun</p>
                        <Button onClick={handleGiveFeedback} variant="primary">Give Feedback</Button>
                    </Card>
                    <Card header="Student Group 2" />
                    <Card header="Student Group 3" />
                    <Card header="Student Group 4" />
                </MainContent>
            </Container>
        </div>
    );
};

export default Dashboard;
