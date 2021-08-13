const express = require('express');
const router = express.Router();
const superAdmin = require('../controllers/superAdmin');
const { registrationValidator } = require('../middleware/authValidators');

router.get('/dashboard', superAdmin.getDashboard);

// RestaurantType routes
router.post('/addRestaurantType', superAdmin.addRestaurantType);

router.put('/updateRestaurantType/:id', superAdmin.updateRestaurantType);

router.put(
	'/deactivateRestaurantType/:id',
	superAdmin.deactivateRestaurantType
);

router.put('/activateRestaurantType/:id', superAdmin.activateRestaurantType);

// MenuType routes
router.post('/addMenuType', superAdmin.addMenuType);

router.put('/updateMenuType/:id', superAdmin.updateMenuType);

router.put('/deactivateMenuType/:id', superAdmin.deactivateMenuType);

router.put('/activateMenuType/:id', superAdmin.activateMenuType);

// PaymentType routes
router.post('/addPaymentType', superAdmin.addPaymentType);

router.put('/updatePaymentType/:id', superAdmin.updatePaymentType);

router.put('/deactivatePaymentType/:id', superAdmin.deactivatePaymentType);

router.put('/activatePaymentType/:id', superAdmin.activatePaymentType);

// OrderStatus routes
router.post('/addOrderStatusType', superAdmin.addOrderStatusType);

router.put('/updateOrderStatusType/:id', superAdmin.updateOrderStatusType);

router.put(
	'/deactivateOrderStatusType/:id',
	superAdmin.deactivateOrderStatusType
);

router.put('/activateOrderStatusType/:id', superAdmin.activateOrderStatusType);

// Restaurant routes
router.get('/addRestaurant', superAdmin.getRestaurantForm);

router.post('/addRestaurant', superAdmin.postRestaurantForm);

router.get('/restaurant/:id', superAdmin.getRestaurantById);

router.put('/updateRestaurant/:id', superAdmin.updateRestaurant);

router.put('/deactivateRestaurant/:id', superAdmin.deactivateRestaurant);

router.put('/activateRestaurant/:id', superAdmin.activateRestaurant);

router.get('/register/:id', superAdmin.getAdminRegister);

router.post('/register/:id', registrationValidator, superAdmin.postAdminRegister);

module.exports = router;
