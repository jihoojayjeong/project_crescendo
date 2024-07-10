import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Nav, Tab, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Sidebar = ({ isOpen, toggleSidebar, handleLogout, user, handleClickDashboard, handleClickManageStudents, handleClickCourses }) => (
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
                    <Button onClick={handleClickCourses} variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Courses</Button>
                    <Button onClick={handleClickManageStudents} variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Manage Students</Button>
                    <Button variant="light" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#6a5acd', color: 'white' }}>Settings</Button>
                </div>
                <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                    <Button onClick={handleLogout} variant="danger" style={{ marginTop: '1rem', width: '100%' }}>Sign Out</Button>
                </div>
            </>
        )}
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

const CourseDetails = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`https://crescendo.cs.vt.edu:8080/getCourse/${courseId}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setCourse(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://crescendo.cs.vt.edu:8080/getUser', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchCourseDetails();
        fetchUserData();
    }, [courseId]);

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

    const handleClickCourses = (event) => {
        event.preventDefault();
        navigate('/Courses');
    }

    const handleLogout = () => {
        const casLogoutUrl = 'https://login.vt.edu/profile/cas/logout';
        const redirectionUrl = 'https://crescendo.cs.vt.edu/';
        window.location.href = `${casLogoutUrl}?service=${encodeURIComponent(redirectionUrl)}`;
    };

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ToastContainer />
            <div style={{ display: 'flex', width: '100%' }}>
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    toggleSidebar={toggleSidebar} 
                    handleLogout={handleLogout} 
                    user={user} 
                    handleClickDashboard={handleClickDashboard} 
                    handleClickManageStudents={handleClickManageStudents} 
                    handleClickCourses={handleClickCourses} 
                />
                <MainContent isSidebarOpen={isSidebarOpen}>
                    <h1>Course Details</h1>
                    <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                {course && (
                <>
                <h2>{course.name}</h2>
                <p>Term: {course.term}</p>
                <p>CRN: {course.crn}</p>
                </>
            )}
          </div>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="assignments">
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="assignments">Assignments</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="students">Students</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="feedbacks">Feedbacks</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="assignments">
                                <h2>Assignments</h2>
                                {/* Assignments content here */}
                            </Tab.Pane>
                            <Tab.Pane eventKey="students">
                                <h2>Students</h2>
                                {/* Students content here */}
                            </Tab.Pane>
                            <Tab.Pane eventKey="feedbacks">
                                <h2>Feedbacks</h2>
                                {/* Feedbacks content here */}
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </MainContent>
            </div>
        </div>
    );
};

export default CourseDetails;
