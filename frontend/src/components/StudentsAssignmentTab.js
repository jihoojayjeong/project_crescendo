import React from 'react';

const StudentsAssignmentTab = ({ course }) => {
    const calculateDaysLeft = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) {
            return null;
        } else if (diffDays === 1) {
            return 'Due tomorrow';
        } else {
            return `Due in ${diffDays} days`;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Title</th>
                        <th className="py-3 px-6 text-left">Description</th>
                        <th className="py-3 px-6 text-left">Due Date</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                    {course?.assignments?.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map((assignment) => (
                        <tr key={assignment._id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-4 px-6 text-gray-800">
                                {assignment.name}
                            </td>
                            <td className="py-4 px-6">
                                {assignment.description}
                            </td>
                            <td className="py-4 px-6">
                                <div>{new Date(assignment.dueDate).toLocaleDateString()}</div>
                                {calculateDaysLeft(assignment.dueDate) && (
                                    <div className="text-sm mt-1 font-medium text-blue-600">
                                        {calculateDaysLeft(assignment.dueDate)}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentsAssignmentTab;
