const express = require('express');
const router = express.Router();
const RestaurantController = require('../Controllers/RestaurantController');

router.post('/add', RestaurantController.upload.single('Logo_image'), RestaurantController.addRestaurant);
router.get('/all/restaurants', RestaurantController.getRestaurants);
router.get('/restaurants/:id', RestaurantController.getRestaurantById);
router.delete('/restaurant/:id', RestaurantController.deleteRestaurant);
router.put('/restaurant/:id', RestaurantController.upload.single('Logo_image'), RestaurantController.updateRestaurant);

module.exports = router;


