import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ViewFeedbacksModal = ({ show, onHide, feedbacks, type, groupNumber, courseId, onFeedbackUpdate }) => {
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [editContent, setEditContent] = useState('');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEdit = async (feedback) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/courses/${courseId}/feedbacks/${feedback._id}`,
                { 
                    content: editContent,
                    updatedAt: new Date()
                },
                { withCredentials: true }
            );
            
            toast.success('Feedback updated successfully!');
            setEditingFeedback(null);
            onFeedbackUpdate();
        } catch (error) {
            console.error('Error updating feedback:', error);
            toast.error('Failed to update feedback');
        }
    };

    const handleDelete = async (feedbackId) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await axios.delete(
                    `${process.env.REACT_APP_API_URL}/courses/${courseId}/feedbacks/${feedbackId}`,
                    { withCredentials: true }
                );
                
                toast.success('Feedback deleted successfully!');
                onFeedbackUpdate();
            } catch (error) {
                console.error('Error deleting feedback:', error);
                toast.error('Failed to delete feedback');
            }
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">
                    {type === 'received' 
                        ? `Feedbacks Received by Group ${groupNumber}`
                        : `Feedbacks Sent to Group ${groupNumber}`
                    }
                </h2>
                
                <div className="space-y-4">
                    {feedbacks.length === 0 ? (
                        <p className="text-gray-500 italic">No feedbacks yet.</p>
                    ) : (
                        feedbacks.map((feedback) => (
                            <div key={feedback._id} className="border rounded-lg p-4 bg-gray-50">
                                {editingFeedback === feedback._id ? (
                                    <div className="space-y-2">
                                        <textarea
                                            className="w-full p-2 border rounded"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(feedback)}
                                                className="px-3 py-1 bg-green-600 text-white rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingFeedback(null)}
                                                className="px-3 py-1 bg-gray-400 text-white rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <p className="text-gray-800">{feedback.content}</p>
                                            {type === 'sent' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingFeedback(feedback._id);
                                                            setEditContent(feedback.content);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(feedback._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500 space-y-1">
                                            <p>From: Group {feedback.fromGroup}</p>
                                            <p>Created: {formatDate(feedback.createdAt)}</p>
                                            {feedback.updatedAt && feedback.updatedAt !== feedback.createdAt && (
                                                <p className="text-blue-500">
                                                    Last updated: {formatDate(feedback.updatedAt)}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onHide}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewFeedbacksModal; 