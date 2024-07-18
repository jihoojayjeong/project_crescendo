const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/create', courseController.createCourse);
router.post('/register', courseController.registerCourse);
router.get('/', courseController.getCourses);
router.get('/:courseId', courseController.getCourse);
router.put('/:courseId', courseController.updateCourse);
router.delete('/:courseId', courseController.deleteCourse);

module.exports = router;
