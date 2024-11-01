import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentSidebar from '../components/StudentSidebar';
import StudentsAssignmentTab from '../components/StudentsAssignmentTab';
import TeamsTab from '../components/TeamsTab';
import FeedbacksTab from '../components/FeedbacksTab';
import { FaBook, FaCalendar, FaHashtag, FaUsers } from 'react-icons/fa';
import { handleLogout } from '../utils/casUtils';

const MainContent = ({ children, isSidebarOpen }) => (
    <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {children}
    </div>
);

const CoursePage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
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
                console.log('Course data:', response.data);
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
                console.log('User data:', response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchCourseDetails();
        fetchUserData();
    }, [courseId]);

    useEffect(() => {
        if (user && course) {
            console.log('User group in this course:', course.userGroup);
        }
    }, [user, course]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleClickDashboard = (event) => {
        event.preventDefault();
        navigate('/Dashboard');
    };

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <ToastContainer />
            <StudentSidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                handleLogout={handleLogout} 
                user={user} 
                handleClickDashboard={handleClickDashboard} 
            />
            <MainContent isSidebarOpen={isSidebarOpen}>
                <div className="p-8">
                    <h1 className="text-4xl font-bold mb-6 text-maroon-800">Course Details</h1>
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                        {course && (
                            <>
                                <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center">
                                    <FaBook className="mr-2 text-maroon-800" /> {course.name}
                                </h2>
                                <p className="text-xl mb-2 text-gray-600 flex items-center">
                                    <FaCalendar className="mr-2 text-maroon-800" /> Term: <span className="font-medium ml-1">{course.term}</span>
                                </p>
                                <p className="text-xl mb-2 text-gray-600 flex items-center">
                                    <FaHashtag className="mr-2 text-maroon-800" /> CRN: <span className="font-medium ml-1">{course.crn}</span>
                                </p>
                                <p className="text-xl mb-2 text-gray-600 flex items-center">
                                    <FaUsers className="mr-2 text-maroon-800" /> Group: <span className="font-medium ml-1">
                                        {course.userGroup || 'Not assigned'}
                                    </span>
                                </p>
                            </>
                        )}
                    </div>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <nav className="flex border-b border-gray-200">
                            {['Teams', 'Assignments', 'Feedbacks'].map((tab) => (
                                <button
                                    key={tab.toLowerCase()}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`px-6 py-3 text-sm font-medium ${
                                        activeTab === tab.toLowerCase()
                                            ? 'border-b-2 border-maroon-800 text-maroon-800'
                                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } focus:outline-none transition duration-150 ease-in-out`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                        <div className="p-6">
                            {activeTab === 'teams' && (
                                <TeamsTab course={course} userGroup={course.userGroup} />
                            )}
                            {activeTab === 'assignments' && (
                                <StudentsAssignmentTab course={course} />
                            )}
                            {activeTab === 'feedbacks' && (
                                <FeedbacksTab course={course} />
                            )}
                        </div>
                    </div>
                </div>
            </MainContent>
        </div>
    );
};

export default CoursePage;
