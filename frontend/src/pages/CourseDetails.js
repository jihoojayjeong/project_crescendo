import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
    const [activeTab, setActiveTab] = useState('assignments');

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
        <div className="font-sans bg-gray-100">
            <ToastContainer />
            <div className="flex w-full">
                <FacultySidebar 
                    isOpen={isSidebarOpen} 
                    toggleSidebar={toggleSidebar} 
                    handleLogout={handleLogout} 
                    user={user} 
                    handleClickCourses={handleClickCourses} 
                />
                <MainContent isSidebarOpen={isSidebarOpen}>
                    <h1 className="text-5xl font-bold mb-6 text-maroon-800">Course Details</h1>
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                        {course && (
                            <>
                                <h2 className="text-4xl font-semibold mb-4 text-gray-800">{course.name}</h2>
                                <p className="text-xl mb-2 text-gray-600">Term: <span className="font-medium">{course.term}</span></p>
                                <p className="text-xl mb-2 text-gray-600">CRN: <span className="font-medium">{course.crn}</span></p>
                                <p className="text-xl mb-2 text-gray-600">Course Code: <span className="font-medium">{course.uniqueCode}</span></p> 
                            </>
                        )}
                    </div>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <nav className="flex border-b border-gray-200">
                            {['Assignments', 'Students', 'Groups', 'Feedbacks'].map((tab) => (
                                <button
                                    key={tab.toLowerCase()}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`px-4 py-3 text-sm font-medium ${
                                        activeTab === tab.toLowerCase()
                                            ? 'border-b-2 border-maroon-800 text-maroon-800'
                                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } focus:outline-none transition duration-150 ease-in-out`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                        <div className="p-4">
                            {activeTab === 'assignments' && (
                                <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
                                // Assignments content here
                            )}
                            {activeTab === 'students' && <StudentsTab />}
                            {activeTab === 'groups' && <FacultyGroupTab />}
                            {activeTab === 'feedbacks' && (
                                <h2 className="text-2xl font-semibold mb-4">Feedbacks</h2>
                                // Feedbacks content here
                            )}
                        </div>
                    </div>
                </MainContent>
            </div>
        </div>
    );
};

export default CourseDetails;
