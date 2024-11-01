import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import ViewFeedbacksModal from './ViewFeedbacksModal';
import FeedbackModal from './FeedbackModal';

const FeedbacksTab = ({ course }) => {
    const [groups, setGroups] = useState([]);
    const [userGroup, setUserGroup] = useState(null);
    const [showFeedbacksModal, setShowFeedbacksModal] = useState(false);
    const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
    const [feedbackModalType, setFeedbackModalType] = useState('');
    const [selectedGroupNumber, setSelectedGroupNumber] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groupsResponse = await axios.get(
                    `${process.env.REACT_APP_API_URL}/courses/${course._id}/groups`,
                    { withCredentials: true }
                );
                setGroups(groupsResponse.data.groups);
            } catch (error) {
                console.error('Error fetching groups:', error);
                toast.error('Failed to fetch groups');
            }
        };

        if (course) {
            setUserGroup(course.userGroup);
            fetchGroups();
        }
    }, [course]);

    const handleViewFeedbacks = async (group, type) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/courses/${course._id}/feedbacks`,
                { withCredentials: true }
            );
            
            const filteredFeedbacks = type === 'received'
                ? response.data.filter(f => f.toGroup === userGroup)
                : response.data.filter(f => f.fromGroup === userGroup && f.toGroup === group.groupNumber.toString());
            
            setSelectedFeedbacks(filteredFeedbacks);
            setFeedbackModalType(type);
            setSelectedGroupNumber(group.groupNumber);
            setShowFeedbacksModal(true);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            toast.error('Failed to fetch feedbacks');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">My Group's Feedbacks</h2>
                <button
                    onClick={() => handleViewFeedbacks({ groupNumber: userGroup }, 'received')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    See feedbacks received
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups
                    .filter(group => group.groupNumber.toString() !== userGroup)
                    .map((group) => (
                        <div key={group._id} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4">
                                {group.name || `Group ${group.groupNumber}`}
                            </h3>
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Members:</h4>
                                <ul className="space-y-1">
                                    {group.members.map((member, index) => (
                                        <li 
                                            key={`${group._id}-member-${member._id || index}`}
                                            className="text-sm text-gray-600 flex items-center space-x-2"
                                        >
                                            <FaUser className="text-gray-400" />
                                            <span>{member.name} <span className="text-gray-400">({member.email})</span></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setSelectedGroup(group);
                                        setShowFeedbackModal(true);
                                    }}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Send Feedback
                                </button>
                                <button
                                    onClick={() => handleViewFeedbacks(group, 'sent')}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    See feedbacks sent
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            <ViewFeedbacksModal
                show={showFeedbacksModal}
                onHide={() => setShowFeedbacksModal(false)}
                feedbacks={selectedFeedbacks}
                type={feedbackModalType}
                groupNumber={selectedGroupNumber}
                courseId={course._id}
                onFeedbackUpdate={() => handleViewFeedbacks(
                    { groupNumber: selectedGroupNumber },
                    feedbackModalType
                )}
            />

            {showFeedbackModal && (
                <FeedbackModal
                    show={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                    selectedGroup={selectedGroup}
                    courseId={course._id}
                    fromGroup={userGroup}
                    onFeedbackSubmit={() => {
                        setShowFeedbackModal(false);
                        handleViewFeedbacks(selectedGroup, 'sent');
                    }}
                />
            )}
        </div>
    );
};

export default FeedbacksTab; 