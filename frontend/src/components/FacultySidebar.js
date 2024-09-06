import React from 'react';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import '../styles/sidebar.css';

const FacultySidebar = ({ isOpen, toggleSidebar, handleLogout, user, handleClickCourses }) => (
    <div className={`fixed h-screen bg-maroon-800 text-white p-4 flex flex-col justify-between z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
        <div>
            <div onClick={toggleSidebar} className="cursor-pointer mb-8 block visible relative">
                <i className="fas fa-bars text-2xl text-white"></i>
            </div>
            {isOpen && (
                <>
                    <div className="text-center">
                        <img src="https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg" alt="Profile" className="rounded-full w-24 h-24 mx-auto" />
                        <h3 className="mt-2 text-2xl font-bold">{user ? user.name : 'Loading...'}</h3>
                        <h5 className="text-base mt-1">{user ? user.email : 'Loading...'}</h5>
                        <p className="text-sm mt-1">{user ? (user.role === 'student' ? 'Faculty' : 'Student') : 'Loading...'}</p>
                    </div>
                    <div className="mt-8 text-center">
                        <button onClick={handleClickCourses} className="sidebar-button">
                            <AutoStoriesOutlinedIcon className="mr-2"/>
                            Courses
                        </button>
                        <button className="sidebar-button">
                            <SettingsIcon className="mr-2"/>
                            Settings
                        </button>
                        <button onClick={handleLogout} className="sidebar-button">
                            <LogoutIcon className="mr-2"/>
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    </div>
);

export default FacultySidebar;