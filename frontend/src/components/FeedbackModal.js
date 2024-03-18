import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FeedbackModal = ({ showModal, feedbacks, onHide }) => (
    <Modal show={showModal} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Feedback History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {feedbacks.map((feedback, index) => (
                    <div key={index} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                        <strong>Title:</strong> {feedback.title}
                        <br />
                        <strong>Message:</strong> {feedback.message}
                    </div>
                ))}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
);

export default FeedbackModal;
