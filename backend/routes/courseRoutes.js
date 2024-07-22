const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/create', courseController.createCourse);
router.post('/register', courseController.register);
router.get('/', courseController.getCourses);
router.get('/:courseId', courseController.getCourse);
router.put('/:courseId', courseController.updateCourse);
router.delete('/:courseId', courseController.deleteCourse);
router.get('/user/courses', courseController.getRegisteredCourses); 
router.get('/:courseId/students', courseController.getStudentsInCourse);

module.exports = router;
