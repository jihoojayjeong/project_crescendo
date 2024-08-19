const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/saveName', userController.saveName);
router.get('/resetSession', userController.resetSession);
router.get('/getUser', userController.getUser);
router.get('/getStudents', userController.getStudents);

module.exports = router;
