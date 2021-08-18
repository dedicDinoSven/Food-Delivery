let express = require('express');
let router = express.Router();
let admin = require('../controllers/admin');
const { registrationValidator } = require('../middleware/authValidators');
const parser = require('../middleware/cloudinary');

router.get('/dashboard', admin.getAdminDashboard);

router.put('/updateRestaurant/:id', admin.updateRestaurant);

router.get('/register/:id', admin.getCourierRegister);

router.post('/register/:id', registrationValidator, admin.postCourierRegister);

router.post('/addProduct/:id', parser.single('productPhoto'), admin.addProduct);

router.put('/deactivateProduct/:id', admin.deactivateProduct);

router.put('/activateProduct/:id', admin.activateProduct);

router.get('/addSpecialOffer/:id', admin.getAddSpecialOffer);

router.post('/addSpecialOffer/:id', parser.single('offerPhoto'), admin.postAddSpecialOffer);

router.get('/addProductToOffer/:id', admin.getAddProductToOffer);

router.post('/addProductToOffer/:id', admin.postAddProductToOffer);

module.exports = router;
