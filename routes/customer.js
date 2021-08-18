const express = require('express');
const router = express.Router();
const customer = require('../controllers/customer');
const { registrationValidator } = require('../middleware/authValidators');

router.get('/register', customer.getRegister);

router.post('/register', registrationValidator, customer.postRegister);

router.get('/dashboard', customer.getDashboard);
module.exports = router;
