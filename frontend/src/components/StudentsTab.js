import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
                setStudents(response.data)
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, [courseId])

    return (
        <div>
            <h2>Students</h2>
            <ul>
                {students.map((student, index) => (
                    <li key={index}>{student.name} ({student.email})</li>
                ))}
            </ul>
        </div>
    );
};

export default StudentsTab;