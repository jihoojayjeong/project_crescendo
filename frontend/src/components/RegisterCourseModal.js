import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const RegisterCourseModal = ({ show, handleClose, courseCode, setCourseCode, handleCourseCodeSubmit }) => (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Register Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="formCourseCode">
                    <Form.Label>Enter Course Code</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={courseCode} 
                        onChange={(e) => setCourseCode(e.target.value)} 
                        placeholder="Enter course code"
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleCourseCodeSubmit}>
                Submit
            </Button>
        </Modal.Footer>
    </Modal>
);

export default RegisterCourseModal;
