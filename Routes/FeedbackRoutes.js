const express = require('express');
const router = express.Router();
const FeedbackController = require('../Controllers/FeedbackController');

router.post('/add/feedback', FeedbackController.addFeedback);
router.get('/get/Rated/MenuItem', FeedbackController.gettRatedMenuItem);

module.exports = router;