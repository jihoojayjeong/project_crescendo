import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const FacultyAssignmentTab = ({ course, setCourse }) => {
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ name: '', description: '', dueDate: '' });
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [feedbackTemplates, setFeedbackTemplates] = useState([
        "Positive feedback",
        "Improvements",
        "Suggestions",
        "Any other comments?"
    ]);
    const [newTemplate, setNewTemplate] = useState('');
    const [editingTemplateIndex, setEditingTemplateIndex] = useState(null);

    const handleAddTemplate = () => {
        if (newTemplate.trim()) {
            if (editingTemplateIndex !== null) {
                const updatedTemplates = [...feedbackTemplates];
                updatedTemplates[editingTemplateIndex] = newTemplate;
                setFeedbackTemplates(updatedTemplates);
                setEditingTemplateIndex(null);
            } else {
                setFeedbackTemplates([...feedbackTemplates, newTemplate]);
            }
            setNewTemplate('');
        }
    };

    const handleEditTemplate = (index) => {
        setNewTemplate(feedbackTemplates[index]);
        setEditingTemplateIndex(index);
    };

    const handleDeleteTemplate = (index) => {
        setFeedbackTemplates(feedbackTemplates.filter((_, i) => i !== index));
    };

    const handleCreateAssignment = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/courses/${course._id}/assignments`, {
                ...newAssignment,
                feedbackTemplates
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setCourse(prevCourse => ({
                ...prevCourse,
                assignments: [...prevCourse.assignments, response.data]
            }));
            setShowAssignmentModal(false);
            setNewAssignment({ name: '', description: '', dueDate: '' });
            toast.success('Assignment created successfully');
        } catch (error) {
            console.error('Error creating assignment:', error);
            toast.error('Failed to create assignment');
        }
    };

    const handleEditAssignment = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/courses/${course._id}/assignments/${editingAssignment._id}`, editingAssignment, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setCourse(prevCourse => ({
                ...prevCourse,
                assignments: prevCourse.assignments.map(assignment => 
                    assignment._id === editingAssignment._id ? response.data : assignment
                )
            }));
            setShowAssignmentModal(false);
            setEditingAssignment(null);
            toast.success('Assignment updated successfully');
        } catch (error) {
            console.error('Error updating assignment:', error);
            toast.error('Failed to update assignment');
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/courses/${course._id}/assignments/${assignmentId}`, {
                    withCredentials: true
                });
                setCourse(prevCourse => ({
                    ...prevCourse,
                    assignments: prevCourse.assignments.filter(assignment => assignment._id !== assignmentId)
                }));
                toast.success('Assignment deleted successfully');
            } catch (error) {
                console.error('Error deleting assignment:', error);
                toast.error('Failed to delete assignment');
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100">
            <button 
                onClick={() => setShowAssignmentModal(true)}
                className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
                <FaPlus className="inline mr-2" /> Create Assignment
            </button>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {course.assignments.map(assignment => (
                            <tr key={assignment._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{assignment.name}</td>
                                <td className="px-6 py-4">{assignment.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => {
                                        setEditingAssignment(assignment);
                                        setShowAssignmentModal(true);
                                    }} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDeleteAssignment(assignment._id)} className="text-red-600 hover:text-red-900">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAssignmentModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mb-4">
                                {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <label htmlFor="assignmentName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Title:
                                    </label>
                                    <input
                                        id="assignmentName"
                                        type="text"
                                        className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                        placeholder="Assignment Name"
                                        value={editingAssignment ? editingAssignment.name : newAssignment.name}
                                        onChange={(e) => editingAssignment 
                                            ? setEditingAssignment({...editingAssignment, name: e.target.value})
                                            : setNewAssignment({...newAssignment, name: e.target.value})
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="assignmentDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description:
                                    </label>
                                    <textarea
                                        id="assignmentDescription"
                                        className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                        placeholder="Assignment Description"
                                        rows="3"
                                        value={editingAssignment ? editingAssignment.description : newAssignment.description}
                                        onChange={(e) => editingAssignment
                                            ? setEditingAssignment({...editingAssignment, description: e.target.value})
                                            : setNewAssignment({...newAssignment, description: e.target.value})
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="assignmentDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date:
                                    </label>
                                    <input
                                        id="assignmentDueDate"
                                        type="date"
                                        className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                        value={editingAssignment 
                                            ? new Date(editingAssignment.dueDate).toISOString().split('T')[0]
                                            : newAssignment.dueDate
                                        }
                                        onChange={(e) => editingAssignment
                                            ? setEditingAssignment({...editingAssignment, dueDate: e.target.value})
                                            : setNewAssignment({...newAssignment, dueDate: e.target.value})
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Feedback Templates:
                                    </label>
                                    <ul className="list-disc pl-5">
                                        {feedbackTemplates.map((template, index) => (
                                            <li key={index} className="text-sm text-gray-600 flex items-center">
                                                {template}
                                                <button onClick={() => handleEditTemplate(index)} className="ml-2 text-blue-500 hover:text-blue-700">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDeleteTemplate(index)} className="ml-2 text-red-500 hover:text-red-700">
                                                    <FaTrash />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <input
                                        type="text"
                                        className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                        placeholder="Add custom template"
                                        value={newTemplate}
                                        onChange={(e) => setNewTemplate(e.target.value)}
                                    />
                                    <button
                                        onClick={handleAddTemplate}
                                        className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                                    >
                                        {editingTemplateIndex !== null ? 'Update Template' : '+ Add custom template'}
                                    </button>
                                </div>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={editingAssignment ? handleEditAssignment : handleCreateAssignment}
                                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
                                >
                                    {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAssignmentModal(false);
                                        setEditingAssignment(null);
                                        setNewAssignment({ name: '', description: '', dueDate: '' });
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyAssignmentTab;