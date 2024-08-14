import React from 'react';
import { useLocation } from 'react-router-dom';
import CoursePage from '../pages/CoursePage';
import CourseDetails from '../pages/CourseDetails';

const CourseComponent = () => {
  const location = useLocation();
  const from = location.state?.from || '';
  
  if (from.startsWith('/Dashboard')) {
    return <CoursePage />;
  } else if (from.startsWith('/Courses')) {
    return <CourseDetails />;
  } else {
    return null;
  }
};

export default CourseComponent;