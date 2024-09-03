import { toast, ToastContainer } from 'react-toastify';
import { Container, Row, Col, Form, Button, Navbar } from 'react-bootstrap';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [isLocalEnv] = useState(process.env.NODE_ENV === 'development');
    const [role, setRole] = useState('student');

    useEffect(() => {
        if (!isLocalEnv) {
            axios.get('/auth/checkSession')
                .then(response => {
                    const user = response.data.user;
                    if (user) {
                        window.location.href = user.role === 'student' ? '/Dashboard' : '/Courses';
                    }
                })
                .catch(error => {
                    console.error('No Session Found.', error);
                });
        }
    }, [isLocalEnv]);

    const handleLogin = (event) => {
        event.preventDefault();
        toast.info('Navigating to VT CAS login page...');
        
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

    const headerBar = (
        <Navbar style={{backgroundColor: '#880000', fontFamily: 'Lato', padding: '10px', borderRadius: '10px', fontWeight: '700', color: 'inherit' }}>
            <Navbar.Brand href="#home" style={{ color: '#fff', fontSize: '24px' }}>
                Virginia Tech CS Capstone Feedback Page
            </Navbar.Brand>
        </Navbar>
    );

    const loginForm = (
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isLocalEnv && (
                <Form.Group controlId="roleSelect" style={{ marginBottom: '10px' }}>
                    <Form.Label>Select Role</Form.Label>
                    <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </Form.Control>
                </Form.Group>
            )}
            <Button onClick={handleLogin} style={{ backgroundColor: 'maroon', borderColor: 'maroon', padding: '10px 20px', fontSize: '16px' }} type="submit">CAS Login</Button>
            <Form.Group controlId="formBasicCheckbox" style={{ marginTop: '10px' }}>
                <Form.Check type="checkbox" label="Keep me signed in" />
            </Form.Group>
        </div>
    );

    return (
        <Container fluid className="vh-100">
            <ToastContainer />
            {headerBar}
            <Row className="justify-content-center align-items-center h-100">
                <Col xs={12} md={6} lg={4}>
                    <h1 style={{ fontFamily: 'Lato' }}>Login</h1>
                    {loginForm}
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
