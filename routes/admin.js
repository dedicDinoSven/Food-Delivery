let express = require('express');
let router = express.Router();
let admin = require('../controllers/admin');
const parser = require('../middleware/cloudinary');

router.get('/dashboard', admin.getAdminDashboard);

router.put('/updateRestaurant/:id', admin.updateRestaurant);

router.post('/addProduct/:id', parser.single('productPhoto'), admin.addProduct);

router.put('/updateProduct/:id', admin.updateProduct);

router.put('/deactivateProduct/:id', admin.deactivateProduct);

router.put('/activateProduct/:id', admin.activateProduct);

router.get('/addSpecialOffer/:id', admin.getAddSpecialOffer);

router.post('/addSpecialOffer/:id', parser.single('offerPhoto'), admin.postAddSpecialOffer);

router.get('/addProductToOffer/:id', admin.getAddProductToOffer);

router.post('/addProductToOffer/:id', admin.postAddProductToOffer);

router.post('/report/:id', admin.emailReport);

router.get('/orders', admin.getOrders);

router.put('/approveOrder/:id', admin.approveOrder);
module.exports = router;
