const express = require('express');
const router = express.Router();
const courier = require('../controllers/courier');

router.get('/dashboard', courier.getDashboard);

module.exports = router;
