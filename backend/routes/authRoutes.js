const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');


router.post('/fakeLogin', authController.fakeLogin);
router.get('/checkSession', authController.checkSession);
router.get('/casCallback', authController.handleAuthentication);
router.post('/logout', authController.handleLogout);
module.exports = router;
