import React from 'react';

const StudentsAssignmentTab = ({ course }) => {
    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Assignments</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {course.assignments && course.assignments.map(assignment => (
                            <tr key={assignment._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{assignment.name}</td>
                                <td className="px-6 py-4">{assignment.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentsAssignmentTab;
