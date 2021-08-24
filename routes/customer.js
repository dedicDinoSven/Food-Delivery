const express = require('express');
const router = express.Router();
const customer = require('../controllers/customer');

router.get('/dashboard', customer.getDashboard);

router.post('/setLocation/:id', customer.setLocation);

router.post('/productSearch', customer.productSearch);

router.get('/productSearch/:result?', customer.productSearchResult);

router.post('/productTypeSearch', customer.productTypeSearch);

router.get('/productTypeSearch/:result?', customer.productTypeSearchResult);

router.get('/restaurant/:id', customer.getRestaurant);

router.post('/basket/:id', customer.addToBasket);

router.get('/basket', customer.getBasket);

router.put('/basket/:id', customer.removeFromBasket);

router.post('/order', customer.postOrder);

router.get('/orders', customer.getOrders);
module.exports = router;
