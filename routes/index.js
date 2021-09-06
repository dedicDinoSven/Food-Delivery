const express = require('express');
const router = express.Router();
const index = require('../controllers/index');
const {
	registrationValidator,
	loginValidator
} = require('../middleware/authValidators');
const passport = require('passport');
const access = require('../middleware/access');

router.get('/', index.getWelcome);

router.get('/register', index.getRegister);

router.post('/register', registrationValidator, index.postRegister);

router.get('/login', index.getLogin);

router.post('/login', loginValidator, index.postLogin);

router.post('/setLocation/:id', index.setLocation);

router.get('/logout', index.getLogout);

router.get(
	'/chat',
	passport.authenticate('jwt', { session: false }),
	access.chat,
	index.getChat
);

module.exports = router;
