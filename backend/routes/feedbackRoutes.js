const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/saveFeedback', feedbackController.saveFeedback);
router.get('/getFeedback', feedbackController.getFeedback);

module.exports = router;
