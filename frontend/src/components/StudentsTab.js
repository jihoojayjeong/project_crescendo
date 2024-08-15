import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/StudentsTab.css';  

const StudentsTab = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`https://crescendo.cs.vt.edu:8080/courses/${courseId}/students`, {
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
      const response = await axios.delete(`https://crescendo.cs.vt.edu:8080/courses/${courseId}/students/${studentId}`, {
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
    <div className="students-tab">
      <div className="students-grid">
        {students.map((student) => (
          <div key={student._id} className="student-card">
            <div className="student-info">
              <span className="student-name">{student.name}</span>
              <span className="student-email">{student.email}</span>
            </div>
            <button className="delete-button" onClick={() => handleDelete(student._id)}>
              <i className="fa fa-trash"></i> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsTab;
