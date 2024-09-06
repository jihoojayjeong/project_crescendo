import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import FacultySidebar from '../components/FacultySidebar';
import CreateCourseModal from '../components/CreateCourseModal';
import { FaBook, FaCalendar, FaHashtag, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

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
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchCourses();
        fetchUserData();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses/`, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/getUser`, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        const casLogoutUrl = 'https://login.vt.edu/profile/cas/logout';
        const redirectionUrl = 'https://crescendo.cs.vt.edu/';
        window.location.href = `${casLogoutUrl}?service=${encodeURIComponent(redirectionUrl)}`;
    };

    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`, { state: { from: location.pathname } });
    };

    const handleCreateCourse = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/courses/create`, { name: courseName, term, crn }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            setShowModal(false);
            fetchCourses();
            toast.success('Course created successfully');
        } catch (error) {
            console.error('Error creating course:', error);
            toast.error('Failed to create course');
        }
    };

    const handleUpdateCourse = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/courses/${selectedCourseId}`, { name: courseName, term, crn }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            setShowModal(false);
            fetchCourses();
            toast.success('Course updated successfully');
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('Failed to update course');
        }
    };

    const handleDeleteCourse = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/courses/${selectedCourseId}`, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            setShowDeleteModal(false);
            fetchCourses();
            toast.success('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <FacultySidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                handleLogout={handleLogout} 
                user={user} 
                handleClickCourses={() => {}}
            />
            <div className={`flex-1 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Courses</h1>
                <button 
                    onClick={() => { setShowModal(true); setSelectedCourseId(null); setCourseName(''); setTerm(''); setCrn(''); }}
                    className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                    <FaPlus className="mr-2" /> Create New Course
                </button>
                <div className="bg-white shadow-md rounded my-6">
                    {courses.map((course) => (
                        <div key={course._id} className="border-b border-gray-200 last:border-b-0">
                            <div className="px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer" onClick={() => handleCourseClick(course._id)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FaBook className="text-indigo-600 mr-3" />
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">{course.name}</h3>
                                            <div className="mt-1 max-w-2xl text-sm text-gray-500 flex">
                                                <span className="flex items-center mr-4">
                                                    <FaCalendar className="mr-1" /> {course.term}
                                                </span>
                                                <span className="flex items-center">
                                                    <FaHashtag className="mr-1" /> {course.crn}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button 
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setShowModal(true); 
                                                setCourseName(course.name); 
                                                setTerm(course.term); 
                                                setSelectedCourseId(course._id); 
                                                setCrn(course.crn); 
                                            }}
                                        >
                                            <FaEdit className="inline mr-1" /> Edit
                                        </button>
                                        <button 
                                            className="text-red-600 hover:text-red-900"
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setShowDeleteModal(true); 
                                                setSelectedCourseId(course._id); 
                                            }}
                                        >
                                            <FaTrash className="inline mr-1" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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
            <ToastContainer />
        </div>
    );
};

export default Courses;