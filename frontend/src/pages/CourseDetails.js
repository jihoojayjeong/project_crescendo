import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Nav, Tab } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import FacultySidebar from '../components/FacultySidebar';
import StudentsTab from '../components/StudentsTab'; 
import FacultyGroupTab from '../components/FacultyGroupTab'

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
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses/${courseId}`, {
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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/getUser`, {
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

    const handleClickManageStudents = (event) => {
        event.preventDefault();
        navigate('/ManageStudents');
    };

    const handleClickCourses = (event) => {
        event.preventDefault();
        navigate('/Courses');
    };

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
                <FacultySidebar 
                    isOpen={isSidebarOpen} 
                    toggleSidebar={toggleSidebar} 
                    handleLogout={handleLogout} 
                    user={user} 
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
                                <p>Course Code: {course.uniqueCode}</p> 
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
                                <Nav.Link eventKey="groups">Groups</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="feedbacks">Feedbacks</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="assignment">
                                <h2>Assignmentss</h2>
                                {/* Assignments content here */}
                            </Tab.Pane>
                            <Tab.Pane eventKey="students">
                                <StudentsTab />
                            </Tab.Pane>
                            <Tab.Pane eventKey="groups">
                                <FacultyGroupTab />
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
