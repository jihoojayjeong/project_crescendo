const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController'); 

router.get('/course/:courseId', courseController.getCourse);

module.exports = router;
