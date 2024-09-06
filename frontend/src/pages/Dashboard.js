import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import NameModal from '../components/\bNameModal';
import RegisterCourseModal from '../components/RegisterCourseModal';
import { FaBook, FaCalendar, FaHashtag, FaPlus } from 'react-icons/fa';

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchUserData();
        fetchUserCourses();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/getUser`, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
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
                headers: { 'Content-Type': 'application/json' }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching user courses:', error);
        }
    };

    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`, { state: {from: location.pathname}});
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        const casLogoutUrl = 'https://login.vt.edu/profile/cas/logout';
        const redirectionUrl = 'https://crescendo.cs.vt.edu/';
        window.location.href = `${casLogoutUrl}?service=${encodeURIComponent(redirectionUrl)}`;
    };

    const handleSaveName = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/user/saveName`, { firstName, lastName }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
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
                headers: { 'Content-Type': 'application/json' }
            });
            setCourses([...courses, response.data.course]);
            setShowRegisterModal(false);
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
        <div className="flex h-screen bg-gray-100">
            <StudentSidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                handleLogout={handleLogout} 
                user={user}
            />
            <div className={`flex-1 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
                <button 
                    onClick={handleRegisterCourse}
                    className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                    <FaPlus className="mr-2" /> Register Course
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
                                    <button className="text-indigo-600 hover:text-indigo-900">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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
            <ToastContainer />
        </div>
    );
};

export default Dashboard;