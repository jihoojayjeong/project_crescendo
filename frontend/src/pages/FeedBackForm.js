import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const Card = ({ children, header }) => (
    <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
        <div className="card-header">
            <h3 className="mb-0">{header}</h3>
        </div>
        <div className="card-body p-5 text-center">
            {children}
        </div>
    </div>
);



const Container = ({ children }) => (
    <section className="vh-100" style={{ backgroundColor: '#c6e2ff' }}>
        <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    {children}
                </div>
            </div>
        </div>
    </section>
);

const TextInput = ({ id, label, onChange, value }) => (
    <div className="form-outline">
        <label className="form-label" htmlFor={id}>{label}</label>
        <input type="text" id={id} className="form-control" onChange={onChange} value={value} />
    </div>
);

const TextArea = ({ id, label, onChange, value }) => (
    <div className="form-outline">
        <label className="form-label" htmlFor={id}>{label}</label>
        <textarea className="form-control" id={id} rows="4" onChange={onChange} value={value}></textarea>
    </div>
);

const SubmitButton = ({ onClick }) => (
    <button className="btn btn-primary btn-lg btn-block m-3" type="submit" onClick={onClick}>Submit</button>
);
const HistoryButton = ({ onClick }) => (
    <div className="history_button">
      <Button className="btn" variant='light' onClick={onClick}>
        Feedback History
      </Button>
    </div>
  );

const FeedBackForm = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [feedbacks, setFeedbacks] = useState([]); 
    const [showModal, setShowModal] = useState(false); 
    const navigate = useNavigate();


    const handleSubmitBtn = () => {
        // Create data object with title and message
        const data = {
            title: title,
            message: message
        };
        // Send data to backend using Axios
        axios.post('http://localhost:8080/saveFeedback', data)
            .then(response => {
                // Show success toast message
                toast.success('Data sent successfully');
                setTitle('');
                setMessage('');
            })
            .catch(error => {
                // Show error toast message
                toast.error(`${error}`);
            });
    };

    const fetchFeedbacks = (event) => {
        event.preventDefault();
        navigate('/FeedbackPage');
    };

    return (
        <div>
            <ToastContainer />
            <Container>
                <Card header="Give Your Feedback Here">
                    <TextInput id="titleText" label="Title" onChange={(e) => setTitle(e.target.value)} value={title} />
                    <TextArea id="textAreaExample" label="Message" onChange={(e) => setMessage(e.target.value)} value={message} />
                    <SubmitButton onClick={handleSubmitBtn} />
                    <HistoryButton onClick={fetchFeedbacks} />
                </Card>
            </Container>
        </div>
    );
};
export default FeedBackForm;