const passport = require('passport');
const { validationResult } = require('express-validator');

const Restaurant = require('../models/Restaurant');
const RestaurantType = require('../models/RestaurantType');
const MenuType = require('../models/MenuType');
const Location = require('../models/Location').Location;
const UserType = require('../models/UserType');
const Product = require('../models/Product');
const SpecialOffer = require('../models/SpecialOffer');

exports.getAdminDashboard = async (req, res) => {
	try {
		const restaurant = await Restaurant.findOne({ admin: req.user.id })
			.populate('restaurantType', '-__v')
			.populate('courier', '-__v -password')
			.lean()
			.exec();

		const restaurantTypes = await RestaurantType.find({ active: true })
			.lean()
			.exec();

		const menuTypes = await MenuType.find({ active: true }).lean().exec();

		const products = await Product.find({ restaurant: restaurant._id })
			.populate('menu', '-__v')
			.lean()
			.exec();

		res.render('./admin/dashboard', {
			restaurant,
			restaurantTypes,
			menuTypes,
			products
		});
	} catch (err) {
		res.status(404).send(err);
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
				workingHoursEnd: req.body.workingHoursEnd,
				deliveryDistance: req.body.deliveryDistance
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

exports.getCourierRegister = async (req, res) => {
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
				return res.redirect('/admin/dashboard');
			} catch (err) {
				return next(err);
			}
		}
	)(req, res, next);
};

exports.addProduct = async (req, res) => {
	try {
		const menu = await MenuType.findOne({ name: req.body.productMenu })
			.lean()
			.exec();

		const product = new Product({
			menu: menu._id,
			name: req.body.productName,
			description: req.body.productDesc,
			price: req.body.productPrice,
			photoUrl: req.file.path,
			restaurant: req.params.id
		});
		await product.save();

		res.redirect(303, 'back');
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.deactivateProduct = async (req, res) => {
	try {
		await Product.findByIdAndUpdate(
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

exports.activateProduct = async (req, res) => {
	try {
		await Product.findByIdAndUpdate(
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

exports.getAddSpecialOffer = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);

		res.render('./admin/addSpecialOfferForm', { restaurant });
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.postAddSpecialOffer = async (req, res) => {
	try {
		const specialOffer = new SpecialOffer({
			name: req.body.offerName,
			description: req.body.offerDesc,
			price: req.body.offerPrice,
			photoUrl: req.file.path,
			restaurant: req.params.id,
			dateFrom: req.body.offerDateFrom,
			dateTo: req.body.offerDateTo,
			timeFrom: req.body.offerTimeFrom,
			timeTo: req.body.offerTimeTo
		});
		await specialOffer.save();
		console.log(specialOffer._id);
		res.redirect('/admin/addProductToOffer/' + specialOffer._id);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.getAddProductToOffer = async (req, res) => {
	try {
		const restaurant = await Restaurant.findOne({ admin: req.user.id })
			.lean()
			.exec();

		const products = await Product.find({ restaurant: restaurant._id })
			.lean()
			.exec();

		const specialOffer = await SpecialOffer.findById(req.params.id)
			.lean()
			.exec();

		res.render('./admin/addProductToOfferForm', { products, specialOffer });
	} catch (err) {
		console.log(err);
		res.status(404).send(err);
	}
};

exports.postAddProductToOffer = async (req, res) => {
	try {
		let offerProduct = await Product.findOne({ name: req.body.offerProduct })
			.lean()
			.exec();

		const specialOffer = await SpecialOffer.findByIdAndUpdate(
			req.params.id,
			{
				$push: { products: offerProduct._id }
			},
			{ new: true }
		)
			.lean()
			.exec();

		offerProduct = await Product.findByIdAndUpdate(
			offerProduct._id,
			{ $push: { offers: specialOffer._id } },
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
};
