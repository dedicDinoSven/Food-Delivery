const passport = require('passport');
const { validationResult } = require('express-validator');

exports.getRegister = async (req, res) => {
	res.render('./customer/register');
};

exports.postRegister = async (req, res, next) => {
	passport.authenticate(
		'register',
		{ session: false },
		async (err, user, info) => {
			try {
				const { fullName, email, password, password2 } = req.body;
				let errors = validationResult(req);
				let errorMessages = [];

				errors.array().map((error) => {
					errorMessages.push(error.msg);
				});

				if (errorMessages.length > 0) {
					return res.render('./customer/register', {
						errors: errorMessages,
						fullName: fullName,
						email: email,
						password: password,
						password2: password2,
					});
				}

				if (err) {
					return next(err);
				}

				if (!user) {
					errorMessages.push(info.msg);

					return res.render('./customer/register', {
						errors: errorMessages,
						fullName: fullName,
						email: email,
						password: password,
						password2: password2,
					});
				}

				req.flash('success_msg', info.msg);
				return res.redirect('/login');
			} catch (err) {
				return next(err);
			}
		}
	)(req, res, next);
};
