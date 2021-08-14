const passport = require('passport');
const { validationResult } = require('express-validator');

const RestaurantType = require('../models/RestaurantType');
const MenuType = require('../models/MenuType');
const PaymentType = require('../models/PaymentType');
const OrderStatus = require('../models/OrderStatus');
const Location = require('../models/Location').Location;
const Restaurant = require('../models/Restaurant');
const UserType = require('../models/UserType');

exports.getCourierRegister = async (req, res) => {
    console.log(req.user)
	const restaurant = await Restaurant.findById(req.params.id).lean().exec();
	const currentUserType = await UserType.findById(req.user.userType, 'name')
		.lean()
		.exec();
	console.log(currentUserType);
	res.render('register', {
		restaurantId: restaurant._id,
		currentUserType: currentUserType.name
	});
};

exports.postCourierRegister = async (req, res, next) => {
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

				await Restaurant.findByIdAndUpdate(req.params.id, { courier: user._id })
					.lean()
					.exec();

				req.flash('success_msg', info.msg);
                return res.redirect('/login');
				//return res.redirect('/superAdmin/restaurant/' + req.params.id);
			} catch (err) {
				return next(err);
			}
		}
	)(req, res, next);
};
