let express = require('express');
let router = express.Router();
let admin = require('../controllers/admin');
const { registrationValidator } = require('../middleware/authValidators');

router.get('/register/:id', admin.getCourierRegister);

router.post('/register/:id', registrationValidator, admin.postCourierRegister);


module.exports = router;
