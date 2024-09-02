const express = require('express');
const router = express.Router();
const FeedbackController = require('../Controllers/FeedbackController');

router.post('/add/feedback', FeedbackController.addFeedback);

module.exports = router;