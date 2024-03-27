import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Row, Col, Form, Button, Navbar } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import GoogleSignInButton from '../components/GoogleSignBtn';

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        toast.info('Login attempt with ID: ' + id);
        // login stuff going on
    };

    const headerBar = (
        <Navbar style={{ backgroundColor: '#880000', fontFamily: 'Lato', padding: '10px', borderRadius: '10px', fontWeight : '700',
        color : 'inherit' }}>
          <Navbar.Brand href="#home" style={{ color: '#fff', fontSize: '24px' }}>
            Virginia Tech CS Capstone Feedback Page
          </Navbar.Brand>
        </Navbar>
      );
      
      

const loginForm = (
    <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>ID</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter ID" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
          />
        </Form.Group>
  
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </Form.Group>
  
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Keep me signed in" />
        </Form.Group>
  
        <Button style={{ backgroundColor: 'maroon', borderColor: 'maroon' }} type="submit">Login</Button>

      </Form>
    </div>
  );

  const googleSignInSection = (
    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ marginBottom: '10px' }}>Or Sign in With</span>
        <GoogleSignInButton />
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
          {/* {googleSignInSection} */}
        </Col>
      </Row>
    </Container>
  );
  
};

export default LoginPage;
