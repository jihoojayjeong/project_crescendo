import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card, Modal, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '/home/sangwonlee/project_cresendo/frontend/src/styles/courseDetails.css';
import FacultySidebar from '../components/FacultySidebar';
import '/home/sangwonlee/project_cresendo/frontend/src/styles/courses.css';
import NameModal from '../components/NameModal';
import CreateCourseModal from '../components/CreateCourseModal';

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

const Courses = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [term, setTerm] = useState('');
    const [crn, setCrn] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showNameModal, setShowNameModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://crescendo.cs.vt.edu:8080/user/getUser', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Response Data :", JSON.stringify(response.data, null, 2));
                if (response.data.isFirstLogin) {
                    setShowNameModal(true);
                }
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://crescendo.cs.vt.edu:8080/courses/', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Fetched Courses: ", response.data);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchUserData();
        fetchCourses();
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`, { state: { from: location.pathname } });
    };

    const handleClickManageStudents = (event) => {
        event.preventDefault();
        navigate('/ManageStudents');
    }

    const handleDeleteCourse = async () => {
        try {
            const response = await axios.delete(`https://crescendo.cs.vt.edu:8080/courses/${selectedCourseId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success('Course deleted successfully!');
                setCourses(courses.filter(course => course._id !== selectedCourseId));
                setShowDeleteModal(false);
                setSelectedCourseId(null);
            }
        } catch (error) {
            toast.error('Failed to delete course');
            console.error('Error deleting course:', error);
        }
    };

    const handleUpdateCourse = async () => {
        try {
            const response = await axios.put(`https://crescendo.cs.vt.edu:8080/courses/${selectedCourseId}`, {
                name: courseName,
                term: term,
                crn: crn
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success('Course updated successfully!');
                setCourses(courses.map(course => course._id === selectedCourseId ? response.data : course));
                setShowModal(false);
                setCourseName('');
                setTerm('');
                setCrn('');
                setSelectedCourseId(null);
            }
        } catch (error) {
            toast.error('Failed to update course');
            console.error('Error updating course:', error);
        }
    };

    const handleLogout = () => {
        const casLogoutUrl = 'https://login.vt.edu/profile/cas/logout';
        const redirectionUrl = 'https://crescendo.cs.vt.edu/';
        window.location.href = `${casLogoutUrl}?service=${encodeURIComponent(redirectionUrl)}`;
    };

    const handleCreateCourse = async () => {
        try {
            const response = await axios.post('https://crescendo.cs.vt.edu:8080/courses/create', {
                name: courseName,
                term: term,
                crn: crn
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                toast.success('Course created successfully!');
                setCourses([...courses, response.data]);
                setShowModal(false);
                setCourseName('');
                setTerm('');
                setCrn('');
                setSelectedCourseId(null);
            }
        } catch (error) {
            toast.error('Failed to create course');
            console.error('Error creating course:', error);
        }
    };

    const handleSaveName = async () => {
        try {
            await axios.post('https://crescendo.cs.vt.edu:8080/user/saveName', { firstName, lastName }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUser(prevState => ({ ...prevState, name: `${firstName} ${lastName}`, isFirstLogin: false }));
            setShowNameModal(false);
            toast.success('Name saved successfully');
        } catch (error) {
            console.error('Error saving name:', error);
            toast.error('Failed to save name');
        }
    };

    return (
        <div>
            <ToastContainer />
            <Container>
                <FacultySidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} user={user} handleClickManageStudents={handleClickManageStudents} />
                <MainContent isSidebarOpen={isSidebarOpen}>
                    <h1>Courses</h1>
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Row>
                            <Col>
                                <div className="d-flex flex-column align-items-center">
                                    {courses.map((course) => (
                                        <Card key={course._id} className="my-3 course-card" style={{ width: '80%' }} onClick={() => handleCourseClick(course._id)}>
                                            <Card.Body className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <Card.Title>
                                                        {course.name}
                                                        <span style={{ fontSize: '0.8em', color: 'gray', marginLeft: '10px' }}>CRN: {course.crn}</span>
                                                    </Card.Title>
                                                    <Card.Text>{course.term}</Card.Text>
                                                </div>
                                                <div className="d-flex">
                                                    <Button variant="secondary" style={{ marginRight: '10px' }} onClick={(e) => { e.stopPropagation(); setShowModal(true); setCourseName(course.name); setTerm(course.term); setSelectedCourseId(course._id); setCrn(course.crn); }}>
                                                        <i className="fas fa-edit"></i>
                                                    </Button>
                                                    <Button variant="danger" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); setSelectedCourseId(course._id); }}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            </Col>
                            <Col>
                                <Button variant="primary" onClick={() => {
                                    setShowModal(true); setSelectedCourseId(null); setCourseName(''); setTerm(''); setCrn('');
                                }}
                                    className='create-course-button'>
                                    Create New Course</Button>
                            </Col>
                        </Row>
                        <CreateCourseModal
                            show={showModal}
                            handleClose={() => setShowModal(false)}
                            courseName={courseName}
                            setCourseName={setCourseName}
                            term={term}
                            setTerm={setTerm}
                            crn={crn}
                            setCrn={setCrn}
                            handleSave={selectedCourseId ? handleUpdateCourse : handleCreateCourse}
                            isUpdate={Boolean(selectedCourseId)}
                        />
                        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this course?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleDeleteCourse}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <NameModal
                            show={showNameModal}
                            handleClose={() => setShowNameModal(false)}
                            firstName={firstName}
                            setFirstName={setFirstName}
                            lastName={lastName}
                            setLastName={setLastName}
                            handleSaveName={handleSaveName}
                        />
                    </div>
                </MainContent>
            </Container>
        </div>
    );
};

export default Courses;
