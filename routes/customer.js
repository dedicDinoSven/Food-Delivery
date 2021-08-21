const express = require('express');
const router = express.Router();
const customer = require('../controllers/customer');
const { registrationValidator } = require('../middleware/authValidators');

router.get('/register', customer.getRegister);

router.post('/register', registrationValidator, customer.postRegister);

router.get('/dashboard', customer.getDashboard);

router.post('/setLocation/:id', customer.setLocation);

router.post('/productSearch', customer.productSearch);

router.get('/productSearch/:result?', customer.productSearchResult);

router.post('/productTypeSearch', customer.productTypeSearch);

router.get('/productTypeSearch/:result?', customer.productTypeSearchResult);

module.exports = router;
