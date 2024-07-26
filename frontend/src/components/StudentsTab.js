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
        console.log("Fetched Students: ", response.data);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [courseId]);

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`https://crescendo.cs.vt.edu:8080/courses/${courseId}/students/${studentId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setStudents(students.filter(student => student._id !== studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
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
