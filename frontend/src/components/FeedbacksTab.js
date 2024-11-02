import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    FaUser, 
    FaPaperPlane, 
    FaInbox,         
    FaRegPaperPlane  
} from 'react-icons/fa';
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

    useEffect(() => {
        if (course) {
            setUserGroup(course.userGroup);
            fetchGroups();

            const intervalId = setInterval(fetchGroups, 5000);

            return () => clearInterval(intervalId);
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Group's Feedbacks</h2>
                <button
                    onClick={() => handleViewFeedbacks({ groupNumber: userGroup }, 'received')}
                    className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 
                             hover:bg-indigo-100 rounded-lg transition-all duration-200 
                             shadow-sm hover:shadow space-x-2"
                >
                    <FaInbox className="text-lg" />
                    <span>View Received Feedbacks</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups
                    .filter(group => group.groupNumber.toString() !== userGroup)
                    .map((group) => (
                        <div key={group._id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">
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
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setSelectedGroup(group);
                                        setShowFeedbackModal(true);
                                    }}
                                    className="w-full inline-flex items-center justify-center px-4 py-2 
                                             bg-gradient-to-r from-emerald-500 to-teal-500 text-white 
                                             rounded-lg hover:from-emerald-600 hover:to-teal-600 
                                             transition-all duration-200 shadow-sm hover:shadow space-x-2"
                                >
                                    <FaPaperPlane className="text-lg" />
                                    <span>Send Feedback</span>
                                </button>
                                <button
                                    onClick={() => handleViewFeedbacks(group, 'sent')}
                                    className="w-full inline-flex items-center justify-center px-4 py-2 
                                             bg-gradient-to-r from-violet-500 to-purple-500 text-white 
                                             rounded-lg hover:from-violet-600 hover:to-purple-600 
                                             transition-all duration-200 shadow-sm hover:shadow space-x-2"
                                >
                                    <FaRegPaperPlane className="text-lg" />
                                    <span>View Sent Feedbacks</span>
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