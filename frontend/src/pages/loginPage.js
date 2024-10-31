import { toast, ToastContainer } from 'react-toastify';
import { Container, Row, Col, Form, Button, Navbar } from 'react-bootstrap';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [isLocalEnv] = useState(process.env.NODE_ENV === 'development');
    //use this param to determine if the user is a student or faculty in dev environment!
    const [role, setRole] = useState('faculty');

    const handleLogin = (event) => {
        event.preventDefault();
        toast.info('Navigating to VT CAS login page...', {
            autoClose: 2000
        });
        
        if(isLocalEnv) {
            console.log("THIS IS LOCAL!");
            axios.post('/auth/fakeLogin', { role }) 
                .then(response => {
                    const redirectUrl = role === 'student' ? 'http://localhost:3000/Dashboard' : 'http://localhost:3000/Courses';
                    window.location.href = redirectUrl;
                })
                .catch(error => {
                    console.error('Failed to fake login', error);
                });
        } else {
            console.log("Redirecting to CAS login URL:", process.env.REACT_APP_CAS_LOGIN_URL);
            window.location.href = process.env.REACT_APP_CAS_LOGIN_URL;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <ToastContainer />
            <div className="bg-[#861F41] text-white py-4 px-6 shadow-md">
                <h1 className="text-2xl font-bold">Virginia Tech CS Crescendo</h1>
            </div>
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Welcome to Crescendo!!!~~~~
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Please log in to access the system
                        </p>
                    </div>
                    <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {isLocalEnv && (
                            <div className="mb-4">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Select Role
                                </label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#861F41] focus:border-[#861F41] sm:text-sm rounded-md"
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <button
                                onClick={handleLogin}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#861F41] hover:bg-[#630F2F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#861F41]"
                            >
                                CAS Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;