const express = require('express');
const router = express.Router();
const index = require('../controllers/index');
const {
	registrationValidator,
	loginValidator
} = require('../middleware/authValidators');
const passport = require('passport');
const access = require('../middleware/access');

router.get('/', index.getLogin);

router.post('/', loginValidator, index.postLogin);

router.get('/register', index.getRegister);

router.post('/register', registrationValidator, index.postRegister);

router.post('/setLocation/:id', index.setLocation);

router.get('/logout', index.getLogout);

router.get(
	'/chat',
	passport.authenticate('jwt', { session: false }),
	access.chat,
	index.getChat
);

module.exports = router;
