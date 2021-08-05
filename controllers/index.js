const passport = require('passport');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.getWelcome = (req, res) => {
	res.render('welcome');
};

exports.getLogin = (req, res) => {
	res.render('login');
};

exports.postLogin = async (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			let errors = validationResult(req);
			let errorMessages = [];

			errors.array().map((error) => {
				errorMessages.push(error.msg);
			});

			if (errorMessages.length > 0) {
				return res.render('login', { errors: errorMessages, });
			}

			if (err) {
				return next(err);
			}

			if (!user) {
				errorMessages.push(info.msg);

				return res.render('login', { errors: errorMessages, });
			}

			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);

				const body = {
					id: user._id,
					fullName: user.fullName,
					email: user.email,
				};

				const token = jwt.sign({ user: body }, 'TOP_SECRET');
				res.cookie('jwt', token);
				
				return res.redirect('/dashboard'); // send token back to user
			});
		} catch (err) {
			return next(err);
		}
	})(req, res, next);
};

exports.getDashboard = (req, res) => {
	res.render('dashboard');
};

exports.getLogout = (req, res) => {
	req.logout();
	req.flash('success_msg', 'Logged out successfully');
	res.clearCookie('jwt');
	res.redirect('/login');
}
