import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FeedbackModal = ({ show, onClose, selectedGroup, courseId, fromGroup, onFeedbackSubmit }) => {
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/courses/${courseId}/feedbacks`,
                {
                    fromGroup,
                    toGroup: selectedGroup.groupNumber,
                    content: feedback
                },
                { withCredentials: true }
            );
            
            toast.success('Feedback sent successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            onFeedbackSubmit();
            setFeedback('');
        } catch (err) {
            setError('Failed to submit feedback');
            toast.error('Failed to send feedback. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error(err);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">
                    Give Feedback to Group {selectedGroup.groupNumber}
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full h-32 p-2 border rounded mb-4"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Write your feedback here..."
                        required
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-maroon-800 text-white rounded hover:bg-maroon-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal; 