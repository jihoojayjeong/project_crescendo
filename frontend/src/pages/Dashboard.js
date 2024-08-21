import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import StudentSidebar from '../components/StudentSidebar';
import NameModal from '../components/\bNameModal';
import { Button, Form, Card } from 'react-bootstrap';
import RegisterCourseModal from '../components/RegisterCourseModal';

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
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showRegisterInput, setShowRegisterInput] = useState(false); 
    const [courseCode, setCourseCode] = useState(''); 
    const [courses, setCourses] = useState([]); 
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/getUser`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Response Data :", JSON.stringify(response.data, null, 2))
                if (response.data.isFirstLogin) {
                    setShowModal(true);
                }
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchUserCourses = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses/user/courses`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Fetched Courses: ", response.data);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching user courses:', error);
            }
        };

        fetchUserData();
        fetchUserCourses();
    }, []);

    const handleCourseClick = (courseId) => {
        console.log('Navigating to course with ID:', courseId);
        navigate(`/course/${courseId}`, { state: {from: location.pathname}});
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        const casLogoutUrl = 'https://login.vt.edu/profile/cas/logout';
        const redirectionUrl = 'https://crescendo.cs.vt.edu/';
        window.location.href = `${casLogoutUrl}?service=${encodeURIComponent(redirectionUrl)}`;
    };

    const handleSaveName = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}user/saveName`, { firstName, lastName }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUser(prevState => ({ ...prevState, name: `${firstName} ${lastName}`, isFirstLogin: false }));
            setShowModal(false);
            toast.success('Name saved successfully');
        } catch (error) {
            console.error('Error saving name:', error);
            toast.error('Failed to save name');
        }
    };

    const handleRegisterCourse = () => {
        setShowRegisterModal(true);
    };

    const handleCourseCodeSubmit = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/courses/register`, { uniqueCode: courseCode }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setCourses([...courses, response.data.course]); 
            toast.success(response.data.message);
        } catch (error) {
            console.error('Error registering course:', error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to register for the course');
            }
        }
    };
    

    return (
        <div>
            <ToastContainer />
            <Container>
                <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} user={user} />
                <MainContent isSidebarOpen={isSidebarOpen}>
                    <h1>Dashboard</h1>
                    <Button variant="primary" onClick={handleRegisterCourse}>Register Course</Button>
                    {courses.map((course, index) => (
                        <Card key={index} style={{ marginTop: '20px', cursor: 'pointer' }} onClick={() => handleCourseClick(course._id)}>
                            <Card.Header>{course.name}</Card.Header>
                            <Card.Body>
                                <Card.Title>Term: {course.term}</Card.Title>
                                <Card.Text>CRN: {course.crn}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </MainContent>
            </Container>
            <NameModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                firstName={firstName} 
                setFirstName={setFirstName} 
                lastName={lastName} 
                setLastName={setLastName} 
                handleSaveName={handleSaveName} 
            />
            <RegisterCourseModal 
                show={showRegisterModal} 
                handleClose={() => setShowRegisterModal(false)} 
                courseCode={courseCode} 
                setCourseCode={setCourseCode} 
                handleCourseCodeSubmit={handleCourseCodeSubmit} 
            />
        </div>
    );
};

export default Dashboard;