const express = require('express');
const router = express.Router();
const index = require('../controllers/index');
const { loginValidator } = require('../middleware/authValidators');
const passport = require('passport');

router.get('/', index.getWelcome);

router.get('/login', index.getLogin);

router.post('/login', loginValidator, index.postLogin);

router.get(
	'/dashboard',
	passport.authenticate('jwt', { session: false }),
	index.getDashboard
);

router.get('/logout', index.getLogout);

module.exports = router;
