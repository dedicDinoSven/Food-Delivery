const passport = require('passport');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const Location = require('../models/Location').Location;
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
const MenuType = require('../models/MenuType');

exports.getRegister = async (req, res) => {
	res.render('register', { currentUserType: undefined });
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

exports.getDashboard = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).lean().exec();
		const restaurants = await Restaurant.find({ active: true })
			.populate('restaurantType', '-__v')
			.lean()
			.exec();

		//console.log(restaurants);
		res.render('./customer/dashboard', {
			user: user,
			restaurants: restaurants
		});
	} catch (err) {
		res.status(404).send(err);
	}
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

exports.productSearch = (req, res) => {
	let result = req.body.searchProduct;
	res.redirect('/customer/productSearch/' + result);
};

exports.productSearchResult = async (req, res) => {
	try {
		const result = req.params.result;
		const regex = new RegExp(result, 'i');

		const products = await Product.find({
			name: { $regex: regex },
			active: true
		})
			.populate('menu', '-__v')
			.populate('restaurant', '-__v -admin -courier')
			.lean()
			.exec();
		
		res.render('./customer/productSearchResults', { products });
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.productTypeSearch = (req, res) => {
	let result = req.body.searchProductType;
	res.redirect('/customer/productTypeSearch/' + result);
};

exports.productTypeSearchResult = async (req, res) => {
	try {
		const result = req.params.result;
		const regex = new RegExp(result, 'i');

		const menu = await MenuType.findOne({ name: { $regex: regex } })
			.lean()
			.exec();
		
		const products = await Product.find({ menu: menu._id })
			.populate('menu', '-__v')
			.populate('restaurant', '-__v -admin -courier')
			.lean()
			.exec();
		
		res.render('./customer/productSearchResults', { products });
	} catch (err) {
		res.status(404).send(err);
	}
};
