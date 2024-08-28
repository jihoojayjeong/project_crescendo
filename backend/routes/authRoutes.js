const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/fakeLogin', authController.fakeLogin);
//router.get('/Dashboard', authController.handleAuthentication);
router.get('/checkSession', authController.checkSession);
//router.get('/Courses', authController.handleAuthentication); 
router.get('/casCallback', authController.handleAuthentication);
module.exports = router;
