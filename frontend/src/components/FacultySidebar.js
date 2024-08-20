import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/sidebar.css';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const FacultySidebar = ({ isOpen, toggleSidebar, handleLogout, user, handleClickManageStudents, handleClickCourses }) => (
    <div style={{
        width: isOpen ? '250px' : '80px',
        transition: 'width 0.3s',
        backgroundColor: '#800000',
        height: '100vh',
        position: 'fixed',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 1000
    }}>
        <div>
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
                        <Button onClick={handleClickCourses} className="custom-button mb-4 button-spacing">
                        <AutoStoriesOutlinedIcon className="icon"/>
                            Courses</Button>
                        <Button onClick={handleClickManageStudents} className="custom-button mb-4">
                        <PeopleIcon className="icon"/>
                            Manage Students</Button>
                        <Button variant="light" className="custom-button mb-4">
                        <SettingsIcon className="icon"/>
                            Settings</Button>
                        <Button onClick={handleLogout} className="custom-button mb-4">
                            <LogoutIcon className="icon"/>
                    Sign Out</Button>
                    </div>
                </>
            )}
        </div>
    </div>
);

export default FacultySidebar;
