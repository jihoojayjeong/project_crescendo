import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaTrash, FaUserGraduate } from 'react-icons/fa';

const StudentsTab = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses/${courseId}/students`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [courseId]);

  const handleDelete = async (studentId) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this student?");
    
    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/courses/${courseId}/students/${studentId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        setStudents(prevStudents => prevStudents.filter(student => student._id !== studentId));
        alert('Student successfully removed from the course.');
      } else {
        throw new Error('Failed to remove student');
      }
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Failed to remove student. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <FaUserGraduate className="mr-2" /> Students Enrolled
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">List of students in this course</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {students.map((student) => (
          <li key={student._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-700">{student.name.charAt(0)}</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.email}</div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(student._id)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition duration-150 ease-in-out"
              >
                <FaTrash className="mr-2" /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsTab;
