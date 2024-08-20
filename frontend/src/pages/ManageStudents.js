import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Nav, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import '../styles/sidebar.css';
import FacultySidebar from '../components/FacultySidebar';

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
    const [isSidebarOpen, setSidebarOpen] = useState(true);
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


    const handleClickCourses = (event) => {
        event.preventDefault();
        navigate('/Courses')
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
                <FacultySidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} user={user} handleClickManageStudents={handleClickManageStudents} 
                handleClickCourses={handleClickCourses}/>
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
