import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { FaBook, FaCalendar, FaHashtag } from 'react-icons/fa';

const CreateCourseModal = ({
    show,
    handleClose,
    courseName,
    setCourseName,
    setTerm,
    crn,
    setCrn,
    handleSave,
    isUpdate
}) => {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear + i);

    const [semester, setSemester] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        if (semester && year) {
            setTerm(`${semester} ${year}`);
        }
    }, [semester, year, setTerm]);

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered className="font-sans">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{isUpdate ? 'Update Course' : 'Create Course'}</h3>
                    <button onClick={handleClose} className="text-white hover:text-gray-200 transition duration-150 ease-in-out">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaBook className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="courseName"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-3 sm:text-lg border-gray-300 rounded-md"
                                placeholder="Enter course name (e.g., CS 3214)"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                        <div className="flex space-x-4">
                            <div className="flex-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCalendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="semester"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md"
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value)}
                                >
                                    <option value="">Semester</option>
                                    <option value="Spring">Spring</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Fall">Fall</option>
                                    <option value="Winter">Winter</option>
                                </select>
                            </div>
                            <div className="flex-1 relative rounded-md shadow-sm">
                                <select
                                    id="year"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 sm:text-sm border-gray-300 rounded-md"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                >
                                    <option value="">Year</option>
                                    {yearOptions.map((yr) => (
                                        <option key={yr} value={yr}>{yr}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="crn" className="block text-sm font-medium text-gray-700 mb-1">CRN</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaHashtag className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="crn"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-3 sm:text-lg border-gray-300 rounded-md"
                                placeholder="Enter CRN"
                                value={crn}
                                onChange={(e) => setCrn(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                    <button 
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150 ease-in-out mr-2"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
                    >
                        {isUpdate ? 'Update Course' : 'Create Course'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateCourseModal;
