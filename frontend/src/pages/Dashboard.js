import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

const Sidebar = ({ isOpen, toggleSidebar, handleLogout, user }) => (
    <div style={{
        width: isOpen ? '250px' : '80px',
        transition: 'width 0.3s',
        backgroundColor: '#800000',
        height: '100vh',
        position: 'fixed',
        color: 'white',
        padding: '1rem',
        overflow: 'hidden',
        zIndex: 1000
    }}>
        <div onClick={toggleSidebar} style={{ cursor: 'pointer', marginBottom: '2rem', display: 'block', visibility: 'visible', position: 'relative' }}>
            <i className="fas fa-bars" style={{ fontSize: '1.5rem', color: 'white' }}></i>
        </div>
        {isOpen && (
            <>
                <div style={{ textAlign: 'center' }}>
                    <img src="profile_picture_url" alt="Profile" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                    <h3>{user ? user.username : 'Loading...'}</h3>
                    <p>Group 6</p>
                </div>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Button variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Dashboard</Button>
                    <Button variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Teams</Button>
                    <Button variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Settings</Button>
                </div>
                <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                    <Button variant="secondary" style={{ backgroundColor: '#6a5acd', width: '100%' }}>Create Teams</Button>
                    <Button onClick={handleLogout} variant="danger" style={{ marginTop: '1rem', width: '100%' }}>Sign Out</Button>
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

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://crescendo.cs.vt.edu/api/user', { withCredentials: true }) 
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error.response || error.message || error);
            });
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleGiveFeedback = (event) => {
        event.preventDefault();
        navigate('/Givefeedback');
    };

    const handleLogout = () => {
        const casLogoutUrl = 'https://login.vt.edu/profile/cas/logout';
        const redirectionUrl = 'https://crescendo.cs.vt.edu/';
        window.location.href = `${casLogoutUrl}?service=${encodeURIComponent(redirectionUrl)}`;
    }

    return (
        <div>
            <ToastContainer />
            <Container>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} user={user} />
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
