const mongoose = require('mongoose');
const { sendMailToAdmin } = require('../middleware/nodemailer');

const Restaurant = require('../models/Restaurant');
const RestaurantType = require('../models/RestaurantType');
const MenuType = require('../models/MenuType');
const Location = require('../models/Location').Location;
const Product = require('../models/Product');
const SpecialOffer = require('../models/SpecialOffer');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const User = require('../models/User');
const UserType = require('../models/UserType');

exports.getAdminDashboard = async (req, res) => {
	try {
		const restaurant = await Restaurant.findOne({ admin: req.user.id })
			.populate('restaurantType', '-__v')
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

exports.updateProduct = async (req, res) => {
	try {
		const menu = await MenuType.findOne({ name: req.body.menu }).lean().exec();

		await Product.findByIdAndUpdate(
			req.params.id,
			{
				menu: menu._id,
				name: req.body.name,
				description: req.body.description,
				price: req.body.price
			},
			{ new: true }
		)
			.lean()
			.exec();

		res.redirect(303, 'back');
	} catch (err) {
		console.log(err);
		res.status(404).send(err);
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
		res.status(400).send(err.message);
	}
};

exports.emailReport = async (req, res) => {
	try {
		const restaurantId = new mongoose.Types.ObjectId(req.params.id);
		const startDate = new Date(2021, 7, 1);
		const endDate = new Date(2021, 7, 31);

		const monthsAggregation = await Order.aggregate([
			{
				$match: {
					restaurant: restaurantId,
					orderDate: {
						$gte: startDate,
						$lte: endDate
					}
				}
			},
			{
				$group: {
					_id: {
						year: { $year: '$orderDate' },
						month: { $month: '$orderDate' }
					},
					count: { $sum: 1 }
				}
			}
		]);

		const daysAggregation = await Order.aggregate([
			{
				$match: {
					restaurant: restaurantId,
					orderDate: {
						$gte: startDate,
						$lte: endDate
					}
				}
			},
			{
				$group: {
					_id: {
						year: { $year: '$orderDate' },
						month: { $month: '$orderDate' },
						day: { $dayOfMonth: '$orderDate' }
					},
					count: { $sum: 1 }
				}
			},
			{
				$group: {
					_id: { year: '$_id.year', month: '$_id.month' },
					ordersByDay: { $push: { day: '$_id.day', count: '$count' } }
				}
			},
			{ $sort: { ordersByDay: 1 } }
		]);

		const orderStatus = await OrderStatus.findOne({ name: 'Delivered' })
			.lean()
			.exec();

		//TODO: update after creating 1-n relationship restaurant-courier
		const courierDelivered = await Order.countDocuments({
			restaurant: req.params.id,
			orderDate: {
				$gte: startDate,
				$lte: endDate
			},
			orderStatus: orderStatus._id
		})
			.lean()
			.exec();

		sendMailToAdmin(
			req.user.email,
			daysAggregation[0],
			monthsAggregation,
			courierDelivered
		);

		res.redirect(303, 'back');
	} catch (err) {
		console.error(err);
		res.status(404).send(err.message);
	}
};

exports.getOrders = async (req, res) => {
	try {
		const restaurant = await Restaurant.findOne(
			{ admin: req.user.id },
			'-restaurantType -active -admin -__v'
		)
			.lean()
			.exec();

		const userType = await UserType.findOne({ name: 'Courier' }).lean().exec();

		const couriers = await User.find(
			{ userType: userType._id, active: true },
			'-__v -userType -password -dateJoined -active'
		)
			.lean()
			.exec();

		const orders = await Order.find({ restaurant: restaurant._id }, '-restaurant -__v')
			.populate('orderStatus paymentType customer', '-__v -active -password')
			.lean()
			.exec();

		res.render('./admin/orders', { restaurant, couriers, orders });
	} catch (err) {
		console.error(err);
		res.status(404).send(err.message);
	}
};

exports.approveOrder = async (req, res) => {
	try {
		const orderStatus = await OrderStatus.findOne({ name: 'Approved' }).lean().exec();

		const order = await Order.findByIdAndUpdate(req.params.id, { courier: req.body.courier, orderStatus: orderStatus._id }).lean().exec();

		console.log(order);

		res.redirect(303, 'back');
	} catch (err) {
		console.error(err);
		res.status(404).send(err.message);
	}
}