import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackModal from './FeedbackModal';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const FeedbacksTab = ({ course }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userGroup, setUserGroup] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [editingFeedback, setEditingFeedback] = useState(null);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/courses/${course._id}/feedbacks`,
                { withCredentials: true }
            );
            setFeedbacks(response.data);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
        }
    };

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/courses/${course._id}/groups`,
                    { withCredentials: true }
                );
                setGroups(response.data.groups);
                setUserGroup(course.userGroup);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching groups:', err);
                setError('Failed to load groups');
                setLoading(false);
            }
        };

        fetchGroups();
        fetchFeedbacks();
    }, [course._id]);

    const handleGiveFeedback = (group) => {
        setSelectedGroup(group);
        setShowFeedbackModal(true);
    };

    const handleEditFeedback = async (feedback, newContent) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/courses/${course._id}/feedbacks/${feedback._id}`,
                { content: newContent },
                { withCredentials: true }
            );
            
            toast.success('Feedback updated successfully!');
            fetchFeedbacks();
            setEditingFeedback(null);
        } catch (error) {
            console.error('Error updating feedback:', error);
            toast.error('Failed to update feedback');
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await axios.delete(
                    `${process.env.REACT_APP_API_URL}/courses/${course._id}/feedbacks/${feedbackId}`,
                    { withCredentials: true }
                );
                
                toast.success('Feedback deleted successfully!');
                fetchFeedbacks();
            } catch (error) {
                console.error('Error deleting feedback:', error);
                toast.error('Failed to delete feedback');
            }
        }
    };

    if (loading) return <div>Loading groups...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-semibold mb-4">My Sent Feedbacks</h2>
                <div className="space-y-4">
                    {feedbacks
                        .filter(f => f.fromGroup === userGroup)
                        .map(feedback => (
                            <div key={feedback._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-500 mb-2">
                                            To: Group {feedback.toGroup}
                                        </p>
                                        {editingFeedback === feedback._id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    className="w-full p-2 border rounded"
                                                    defaultValue={feedback.content}
                                                    id={`edit-${feedback._id}`}
                                                />
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="px-3 py-1 bg-maroon-800 text-white rounded text-sm"
                                                        onClick={() => handleEditFeedback(feedback, document.getElementById(`edit-${feedback._id}`).value)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-gray-400 text-white rounded text-sm"
                                                        onClick={() => setEditingFeedback(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-800">{feedback.content}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => setEditingFeedback(feedback._id)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFeedback(feedback._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 ml-4">
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    {feedbacks.filter(f => f.fromGroup === userGroup).length === 0 && (
                        <p className="text-gray-500 italic">No feedbacks sent yet</p>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">All Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group) => (
                    <div 
                        key={group._id} 
                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-xl font-semibold mb-2">
                            Group {group.groupNumber}
                        </h3>
                        <div className="space-y-2">
                            <h4 className="font-medium">Members:</h4>
                            <ul className="list-disc list-inside">
                                {group.members.map((member) => (
                                    <li key={member._id} className="text-gray-600">
                                        {member.name}
                                    </li>
                                ))}
                            </ul>
                            {group.groupNumber.toString() !== userGroup && (
                                <button 
                                    className="mt-4 bg-maroon-800 text-white px-4 py-2 rounded hover:bg-maroon-700 transition-colors"
                                    onClick={() => handleGiveFeedback(group)}
                                >
                                    Give Feedback
                                </button>
                            )}
                            {group.groupNumber.toString() === userGroup && (
                                <div className="mt-4">
                                    <h4 className="font-medium">Received Feedbacks:</h4>
                                    {feedbacks
                                        .filter(f => f.toGroup === userGroup)
                                        .map(feedback => (
                                            <div key={feedback._id} className="mt-2 p-2 bg-gray-50 rounded">
                                                <p>{feedback.content}</p>
                                                <p className="text-sm text-gray-500">
                                                    From: Group {feedback.fromGroup}
                                                </p>
                                            </div>
                                        ))}
                                    {feedbacks.filter(f => f.toGroup === userGroup).length === 0 && (
                                        <p className="text-gray-500 italic">No feedbacks received yet</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showFeedbackModal && (
                <FeedbackModal 
                    show={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                    selectedGroup={selectedGroup}
                    courseId={course._id}
                    fromGroup={userGroup}
                    onFeedbackSubmit={() => {
                        setShowFeedbackModal(false);
                        fetchFeedbacks();
                    }}
                />
            )}
        </div>
    );
};

export default FeedbacksTab;