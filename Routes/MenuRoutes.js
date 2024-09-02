const express = require('express');
const router = express.Router();
const MenuController = require('../Controllers/MenuController');

router.post('/add/menu', MenuController.upload.single('Image'), MenuController.addMenu);
router.get('/menu/restaurant/:restaurant_id', MenuController.getMenuByRestaurant);
router.delete('/menu/:id', MenuController.deleteMenuItem);
router.put('/menu/:id',MenuController.upload.single('Image'), MenuController.updateMenuItem);

module.exports = router;