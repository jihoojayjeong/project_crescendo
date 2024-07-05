import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Nav, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

const Sidebar = ({ isOpen, toggleSidebar, handleLogout, user, handleClickDashboard, handleClickManageStudents }) => (
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
                    <img src="https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg" alt="Profile" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                    <h3>{user ? user.name : 'Loading...'}</h3>
                    <h5>{user ? user.email : 'Loading...'}</h5>
                    <p>{user ? (user.role === 'student' ? 'Faculty' : 'Student') : 'Loading...'}</p>
                </div>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Button onClick={handleClickDashboard} variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Dashboard</Button>
                    <Button onClick={handleClickManageStudents} variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Manage Students</Button>
                    <Button variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Courses</Button>
                    <Button variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Settings</Button>
                </div>
                <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                    <Button onClick={handleLogout} variant="danger" style={{ marginTop: '1rem', width: '100%' }}>Sign Out</Button>
                </div>
            </>
        )}
    </div>
);

const Container = ({ children }) => (
    <div style={{ display: 'flex', width: '100%' }}>
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

const ManageStudentsPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [activeTab, setActiveTab] = useState('students');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://crescendo.cs.vt.edu:8080/getUser', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Response Data :", JSON.stringify(response.data, null, 2));
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        const fetchStudents = async () => {
            try {
                const response = await axios.get('https://crescendo.cs.vt.edu:8080/getStudents', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Fetched Students: ", response.data);
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchUserData();
        fetchStudents();
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleClickDashboard = (event) => {
        event.preventDefault();
        navigate('/FacultyDashboard');
    }

    const handleClickManageStudents = (event) => {
        event.preventDefault();
        navigate('/ManageStudents');
    }

    const handleLogout = () => {
        const casLogoutUrl = 'https://login.vt.edu/profile/cas/logout';
        const redirectionUrl = 'https://crescendo.cs.vt.edu/';
        window.location.href = `${casLogoutUrl}?service=${encodeURIComponent(redirectionUrl)}`;
    };

    const renderStudents = () => (
        <div className="d-flex flex-column align-items-center">
            {students.map((student) => (
                <Card key={student.email} className="my-3" style={{ width: '80%' }}>
                    <Card.Body>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Card.Title>{student.name}</Card.Title>
                            </div>
                            <div style={{ display: 'flex', color: 'gray', textAlign: 'right' }}>
                                <Card.Text>{student.email}</Card.Text>
                            </div>
                            <div style={{ display: 'flex', color: 'gray', textAlign: 'right' }}>
                                <Card.Text>{student.role}</Card.Text>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
    

    const renderGroups = () => (
        <div>
            <p>Group information goes here...</p>
        </div>
    );

    return (
        <div>
            <ToastContainer />
            <Container>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} user={user} handleClickDashboard={handleClickDashboard} handleClickManageStudents={handleClickManageStudents} />
                <MainContent isSidebarOpen={isSidebarOpen}>
                    <h1>Manage Students Page</h1>
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Nav variant="tabs" activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
                            <Nav.Item>
                                <Nav.Link eventKey="students">Students</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="groups">Groups</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        {activeTab === 'students' ? renderStudents() : renderGroups()}
                    </div>
                </MainContent>
            </Container>
        </div>
    );
};

export default ManageStudentsPage;
