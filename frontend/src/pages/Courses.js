import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Nav, Card, Modal, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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
    const [term, setTerm] = useState('Fall 2024');
    const [selectedCourseId, setSelectedCourseId] = useState(null); 
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
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://crescendo.cs.vt.edu:8080/getCourses', {
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

    const handleClickDashboard = (event) => {
        event.preventDefault();
        navigate('/FacultyDashboard');
    }

    const handleClickManageStudents = (event) => {
        event.preventDefault();
        navigate('/ManageStudents');
    }
    
    const handleDeleteCourse = async () => { 
        try {
          const response = await axios.delete(`https://crescendo.cs.vt.edu:8080/deleteCourse/${selectedCourseId}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.status === 200) {
            toast.success('Course deleted successfully!');
            setCourses(courses.filter(course => course._id !== selectedCourseId));
            setShowDeleteModal(false); 
          }
        } catch (error) {
          toast.error('Failed to delete course');
          console.error('Error deleting course:', error);
        }
      };

    const handleUpdateCourse = async () => { 
        try {
            const response = await axios.put(`https://crescendo.cs.vt.edu:8080/updateCourse/${selectedCourseId}`, {
                name: courseName,
                term: term
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
                setTerm('Fall 2024');
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
            const response = await axios.post('https://crescendo.cs.vt.edu:8080/createCourse', {
                name: courseName,
                term: term
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
                setTerm('Fall 2024');
            }
        } catch (error) {
            toast.error('Failed to create course');
            console.error('Error creating course:', error);
        }
    };

    return (
        <div>
          <ToastContainer />
          <Container>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} user={user} handleClickDashboard={handleClickDashboard} handleClickManageStudents={handleClickManageStudents} />
            <MainContent isSidebarOpen={isSidebarOpen}>
              <h1>Courses</h1>
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Row>
                  <Col>
                    <div className="d-flex flex-column align-items-center">
                      {courses.map((course) => (
                        <Card key={course._id} className="my-3" style={{ width: '80%' }}>
                          <Card.Body>
                            <Card.Title>{course.name}</Card.Title>
                            <Card.Text>{course.term}</Card.Text>
                            <Button variant="danger" onClick={() => { setShowDeleteModal(true); setSelectedCourseId(course._id); }}><i className="fas fa-trash-alt"></i></Button>
                            <Button variant="secondary" onClick={() => { setShowModal(true); setCourseName(course.name); setTerm(course.term); setSelectedCourseId(course._id); }}><i className="fas fa-edit"></i></Button>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Col>
                  <Col>
                    <Button variant="primary" onClick={() => setShowModal(true)}>Create New Course</Button>
                  </Col>
                </Row>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>{selectedCourseId ? 'Update Course' : 'Create Course'}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="formCourseName">
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter course name" 
                          value={courseName} 
                          onChange={(e) => setCourseName(e.target.value)} 
                        />
                      </Form.Group>
                      <Form.Group controlId="formTerm">
                        <Form.Label>Term</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter term (e.g., Fall 2024)" 
                          value={term} 
                          onChange={(e) => setTerm(e.target.value)} 
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={selectedCourseId ? handleUpdateCourse : handleCreateCourse}>
                      {selectedCourseId ? 'Update Course' : 'Create Course'}
                    </Button>
                  </Modal.Footer>
                </Modal>
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
              </div>
            </MainContent>
          </Container>
        </div>
      );
};

export default Courses;
