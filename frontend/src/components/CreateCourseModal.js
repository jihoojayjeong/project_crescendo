import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

const CreateCourseModal = ({
    show,
    handleClose,
    courseName,
    setCourseName,
    setTerm,
    crn,
    setCrn,
    handleSave,
    isUpdate
}) => {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear + i);

    const [semester, setSemester] = useState('');
    const [year, setYear] = useState('');

    // Update term whenever semester or year changes
    useEffect(() => {
        if (semester && year) {
            setTerm(`${semester} ${year}`);
        }
    }, [semester, year, setTerm]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isUpdate ? 'Update Course' : 'Create Course'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formCourseName">
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter course name (e.g., CS 3214)"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTerm">
                        <Form.Label>Term</Form.Label>
                        <Row>
                            <Col>
                                <Form.Select
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Semester
                                    </option>
                                    <option value="Spring">Spring</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Fall">Fall</option>
                                    <option value="Winter">Winter</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Year
                                    </option>
                                    {yearOptions.map((yr) => (
                                        <option key={yr} value={yr}>
                                            {yr}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="formCrn">
                        <Form.Label>CRN</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter CRN"
                            value={crn}
                            onChange={(e) => setCrn(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button 
                    variant="primary" 
                    onClick={() => {
                        handleSave();
                    }}>
                    {isUpdate ? 'Update Course' : 'Create Course'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCourseModal;
