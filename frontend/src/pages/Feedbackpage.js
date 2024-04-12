import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = () => {
        axios.get('http://localhost:8080/getFeedback')
            .then(response => {
                setFeedbacks(response.data);
            })
            .catch(error => {
                console.error('Error fetching feedbacks:', error);
            });
    };

    return (
        <Container>
            <h1 className="my-4">Feedback History</h1>
            {feedbacks.length > 0 ? (
                feedbacks.map((feedback, index) => (
                    <Card key={index} className="mb-3">
                        <Card.Header as="h5">Feedback #{index + 1}</Card.Header>
                        <Card.Body>
                            <Card.Title>Title: {feedback.title}</Card.Title>
                            <Card.Text>Message: {feedback.message}</Card.Text>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <div>No feedbacks found</div>
            )}
        </Container>
    );
};

export default FeedbackPage;
