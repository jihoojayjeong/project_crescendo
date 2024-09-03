const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/fakeLogin', authController.fakeLogin);
router.get('/checkSession', authController.checkSession);
router.get('/casCallback', authController.handleAuthentication);
module.exports = router;
