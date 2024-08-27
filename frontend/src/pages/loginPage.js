import { toast, ToastContainer } from 'react-toastify';
import { Container, Row, Col, Form, Button, Navbar } from 'react-bootstrap';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [isLocalEnv, setIsLocalEnv] = useState(false);

    useEffect(() => {
        setIsLocalEnv(process.env.NODE_ENV === 'development');
        
        if (isLocalEnv) {
            // redirect to the Dashboard in local env
            window.location.href = 'http://localhost:3000/Dashboard';
        } else {
            // Check auth in prod evn
            axios.get('/auth/checkSession')
                .then(response => {
                    const user = response.data.user;
                    if (user) {
                        const redirectBaseUrl = 'https://crescendo.cs.vt.edu';
                        if (user.role === 'student') {
                            window.location.href = `${redirectBaseUrl}/Courses`;
                        } else if (user.role === 'professor') {
                            window.location.href = `${redirectBaseUrl}/Dashboard`;
                        }
                    }
                })
                .catch(error => {
                    console.error('No active session', error);
                });
        }
    }, [isLocalEnv]);


    const handleLogin = (event) => {
        event.preventDefault();
        toast.info('Navigating to VT CAS login page...');
        if(isLocalEnv) {
            window.location.href = 'http://localhost:3000/Dashboard';
        } else {
            toast.info('Navigating to VT CAS login page...');
            window.location.href = 'https://login.vt.edu/profile/cas/login?service=https://crescendo.cs.vt.edu/auth/Dashboard';
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
