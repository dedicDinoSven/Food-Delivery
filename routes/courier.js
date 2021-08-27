const express = require('express');
const router = express.Router();
const courier = require('../controllers/courier');

router.get('/dashboard', courier.getDashboard);

router.put('/deliverOrder/:id', courier.deliverOrder);
module.exports = router;
