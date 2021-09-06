const passport = require('passport');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const UserType = require('../models/UserType');
const Location = require('../models/Location').Location;
const User = require('../models/User');

exports.getWelcome = (req, res) => {
	res.render('welcome');
};

exports.getRegister = async (req, res) => {
	res.render('register');
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
					return res.render('register', {
						errors: errorMessages,
						fullName: fullName,
						email: email,
						password: password,
						password2: password2
					});
				}

				if (err) {
					return next(err);
				}

				if (!user) {
					errorMessages.push(info.msg);

					return res.render('register', {
						errors: errorMessages,
						fullName: fullName,
						email: email,
						password: password,
						password2: password2
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
				return res.render('login', { errors: errorMessages });
			}

			if (err) {
				return next(err);
			}

			if (!user) {
				errorMessages.push(info.msg);

				return res.render('login', { errors: errorMessages });
			}

			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);

				const body = {
					id: user._id,
					fullName: user.fullName,
					email: user.email,
					userType: user.userType
				};

				const token = jwt.sign({ user: body }, 'TOP_SECRET');
				res.cookie('jwt', token);

				const userType = await UserType.findOne({ _id: user.userType });

				let redirectUrl = '';
				switch (userType.name) {
					case 'SuperAdmin':
						redirectUrl = './superAdmin/dashboard';
						break;
					case 'Admin':
						redirectUrl = './admin/dashboard';
						break;
					case 'Courier':
						redirectUrl = './courier/dashboard';
						break;
					default:
						redirectUrl = './customer/dashboard';
				}

				return res.redirect(redirectUrl);
			});
		} catch (err) {
			return next(err);
		}
	})(req, res, next);
};

exports.setLocation = async (req, res) => {
	try {
		const location = new Location({
			address: req.body.address,
			lng: req.body.lng,
			lat: req.body.lat,
			streetNum: req.body.streetNum
		});

		await location.save();

		await User.findByIdAndUpdate(req.params.id, { location: location });

		res.redirect(303, 'back');
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.getLogout = (req, res) => {
	req.logout();
	req.flash('success_msg', 'Logged out successfully');
	res.clearCookie('jwt');
	res.redirect('/login');
};

exports.getChat = async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.populate('userType', '-__v -active')
			.lean()
			.exec();
			
		res.render('chat', { user: user });
	} catch (err) {
		res.status(404).send(err.message);
	}
};
