const express = require('express');
const router = express.Router();
const PreferenceController = require('../Controllers/PreferenceController');

router.get('/restaurant/:restaurant_id/user/:user_id/menu', PreferenceController.getMenuByRestaurant);

module.exports = router;