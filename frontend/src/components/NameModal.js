import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const NameModal = ({ show, handleClose, firstName, setFirstName, lastName, setLastName, handleSaveName }) => (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Enter Your Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSaveName}>
                Save
            </Button>
        </Modal.Footer>
    </Modal>
);

export default NameModal;
