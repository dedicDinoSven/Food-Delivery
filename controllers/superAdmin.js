const passport = require('passport');
const { validationResult } = require('express-validator');

const RestaurantType = require('../models/RestaurantType');
const MenuType = require('../models/MenuType');
const PaymentType = require('../models/PaymentType');
const OrderStatus = require('../models/OrderStatus');
const Location = require('../models/Location').Location;
const Restaurant = require('../models/Restaurant');
const UserType = require('../models/UserType');

exports.getDashboard = async (req, res) => {
	const restaurants = await Restaurant.find().lean().exec();
	const restaurantTypes = await RestaurantType.find().lean().exec();
	const menuTypes = await MenuType.find().lean().exec();
	const paymentTypes = await PaymentType.find().lean().exec();
	const orderStatusTypes = await OrderStatus.find().lean().exec();

	res.render('./superAdmin/dashboard', {
		restaurants,
		restaurantTypes,
		menuTypes,
		paymentTypes,
		orderStatusTypes
	});
};

// RestaurantType methods
exports.addRestaurantType = async (req, res) => {
	try {
		console.log(req.body);
		typeof req.body;
		const restaurantType = new RestaurantType({
			name: req.body.name
		});
		await restaurantType.save();

		res.redirect('/superAdmin/dashboard');
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.updateRestaurantType = async (req, res) => {
	try {
		await RestaurantType.findByIdAndUpdate(
			req.params.id,
			{ name: req.body.name },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.deactivateRestaurantType = async (req, res) => {
	try {
		await RestaurantType.findByIdAndUpdate(
			req.params.id,
			{ active: false },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.activateRestaurantType = async (req, res) => {
	try {
		await RestaurantType.findByIdAndUpdate(
			req.params.id,
			{ active: true },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

// MenuType methods
exports.addMenuType = async (req, res) => {
	try {
		const menuType = new MenuType({
			name: req.body.name
		});
		await menuType.save();

		res.redirect('/superAdmin/dashboard');
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.updateMenuType = async (req, res) => {
	try {
		await MenuType.findByIdAndUpdate(
			req.params.id,
			{ name: req.body.name },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.deactivateMenuType = async (req, res) => {
	try {
		await MenuType.findByIdAndUpdate(
			req.params.id,
			{ active: false },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.activateMenuType = async (req, res) => {
	try {
		await MenuType.findByIdAndUpdate(
			req.params.id,
			{ active: true },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

// PaymentType methods
exports.addPaymentType = async (req, res) => {
	try {
		const paymentType = new PaymentType({
			name: req.body.name
		});
		await paymentType.save();

		res.redirect('/superAdmin/dashboard');
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.updatePaymentType = async (req, res) => {
	try {
		await PaymentType.findByIdAndUpdate(
			req.params.id,
			{ name: req.body.name },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.deactivatePaymentType = async (req, res) => {
	try {
		await PaymentType.findByIdAndUpdate(
			req.params.id,
			{ active: false },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.activatePaymentType = async (req, res) => {
	try {
		await PaymentType.findByIdAndUpdate(
			req.params.id,
			{ active: true },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

// OrderStatus methods
exports.addOrderStatusType = async (req, res) => {
	try {
		const orderStatus = new OrderStatus({
			name: req.body.name
		});
		await orderStatus.save();

		res.redirect('/superAdmin/dashboard');
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.updateOrderStatusType = async (req, res) => {
	try {
		await OrderStatus.findByIdAndUpdate(
			req.params.id,
			{ name: req.body.name },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.deactivateOrderStatusType = async (req, res) => {
	try {
		await OrderStatus.findByIdAndUpdate(
			req.params.id,
			{ active: false },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.activateOrderStatusType = async (req, res) => {
	try {
		await OrderStatus.findByIdAndUpdate(
			req.params.id,
			{ active: true },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

// Restaurant methods
exports.getRestaurantForm = async (req, res) => {
	try {
		const restaurantTypes = await RestaurantType.find({ active: true })
			.lean()
			.exec();

		res.render('./superAdmin/restaurantForm', { restaurantTypes });
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.postRestaurantForm = async (req, res) => {
	try {
		const restaurantType = await RestaurantType.findOne({
			name: req.body.restaurantType
		})
			.lean()
			.exec();

		const location = new Location({
			lat: req.body.lat,
			lng: req.body.lng,
			formattedAddress: req.body.formattedAddress,
			address: req.body.address,
			streetNum: req.body.streetNum
		});

		await location.save();

		const restaurant = new Restaurant({
			name: req.body.name,
			restaurantType: restaurantType._id,
			location: location,
			workingHoursStart: req.body.workingHoursStart,
			workingHoursEnd: req.body.workingHoursEnd
		});

		await restaurant.save();
		console.log(restaurantType);
		res.redirect('/superAdmin/dashboard');
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.getRestaurantById = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id)
			.populate('restaurantType', '-__v')
			.populate('admin', '-__v')
			.lean()
			.exec();

		const restaurantTypes = await RestaurantType.find({ active: true })
			.lean()
			.exec();

		res.render('./superAdmin/restaurant', { restaurant, restaurantTypes });
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.updateRestaurant = async (req, res) => {
	try {
		let restaurant = await Restaurant.findById(req.params.id).lean().exec();

		const restaurantType = await RestaurantType.findOne({
			name: req.body.restaurantType
		})
			.lean()
			.exec();

		const location = await Location.findByIdAndUpdate(
			restaurant.location._id,
			{
				lat: req.body.lat,
				lng: req.body.lng,
				formattedAddress: req.body.formattedAddress,
				address: req.body.address,
				streetNum: req.body.streetNum
			},
			{ new: true }
		)
			.lean()
			.exec();

		restaurant = await Restaurant.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name,
				restaurantType: restaurantType._id,
				location: location,
				workingHoursStart: req.body.workingHoursStart,
				workingHoursEnd: req.body.workingHoursEnd
			},
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.deactivateRestaurant = async (req, res) => {
	try {
		await Restaurant.findByIdAndUpdate(
			req.params.id,
			{ active: false },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.activateRestaurant = async (req, res) => {
	try {
		await Restaurant.findByIdAndUpdate(
			req.params.id,
			{ active: true },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.getAdminRegister = async (req, res) => {
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

exports.postAdminRegister = async (req, res, next) => {
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

				await Restaurant.findByIdAndUpdate(req.params.id, { admin: user._id })
					.lean()
					.exec();

				req.flash('success_msg', info.msg);
				return res.redirect('/superAdmin/restaurant/' + req.params.id);
			} catch (err) {
				return next(err);
			}
		}
	)(req, res, next);
};
