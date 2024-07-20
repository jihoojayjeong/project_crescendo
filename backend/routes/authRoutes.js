const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/Dashboard', authController.handleDashboard);
router.get('/checkSession', authController.checkSession);

module.exports = router;