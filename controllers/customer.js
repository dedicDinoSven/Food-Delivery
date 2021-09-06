const User = require('../models/User');
const Location = require('../models/Location').Location;
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
const MenuType = require('../models/MenuType');
const OrderProduct = require('../models/OrderProduct');
const PaymentType = require('../models/PaymentType');
const OrderStatus = require('../models/OrderStatus');
const Order = require('../models/Order');
const OrderReview = require('../models/OrderReview');

const { sendMailToCustomer } = require('../middleware/nodemailer');

exports.getDashboard = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).lean().exec();
		const restaurants = await Restaurant.find({ active: true })
			.populate('restaurantType', '-__v')
			.lean()
			.exec();

		res.render('./customer/dashboard', {
			user: user,
			restaurants: restaurants
		});
	} catch (err) {
		res.status(404).send(err);
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
			.populate('restaurant', '-__v -admin')
			.lean()
			.exec();

		res.render('./customer/searchResults', { products });
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

		const menu = await MenuType.findOne({
			name: { $regex: regex },
			active: true
		})
			.lean()
			.exec();

		const products = await Product.find({ menu: menu._id, active: true })
			.populate('menu', '-__v')
			.populate('restaurant', '-__v -admin')
			.lean()
			.exec();

		res.render('./customer/searchResults', { products });
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.getRestaurant = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(
			req.params.id,
			'-__v -admin'
		)
			.populate('restaurantType', '-__v')
			.lean()
			.exec();

		const products = await Product.find(
			{ restaurant: restaurant._id },
			'-__v -restaurant'
		)
			.populate('menu', '-__v')
			.lean()
			.exec();

		res.render('./customer/restaurant', { restaurant, products });
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.addToBasket = async (req, res) => {
	try {
		const orderProduct = new OrderProduct({
			product: req.params.id,
			price: req.body.price,
			quantity: req.body.quantity,
			fullPrice: req.body.fullPrice,
			customer: req.user.id
		});
		await orderProduct.save();

		res.redirect(303, 'back');
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.getBasket = async (req, res) => {
	try {
		const paymentTypes = await PaymentType.find().lean().exec();

		const order = await OrderProduct.find(
			{
				customer: req.user.id,
				ordered: false,
				active: true
			},
			'-__v -customer'
		)
			.populate('product', '-__v')
			.lean()
			.exec();

		res.render('./customer/basket', { order, paymentTypes, user: req.user });
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.removeFromBasket = async (req, res) => {
	try {
		await OrderProduct.findByIdAndUpdate(
			req.params.id,
			{ active: false },
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

exports.postOrder = async (req, res) => {
	try {
		const paymentType = await PaymentType.findOne({
			name: req.body.paymentType
		})
			.lean()
			.exec();

		const orderStatus = await OrderStatus.findOne({ name: 'Ordered' })
			.lean()
			.exec();

		let today = new Date();
		today.setHours(today.getHours() + 1);
		const orderTime = today.getHours() + ':' + today.getMinutes();

		let order = new Order({
			restaurant: req.body.restaurant,
			customer: req.user.id,
			paymentType: paymentType._id,
			comment: req.body.comment,
			price: req.body.toPay,
			orderTime: req.body.orderTime || orderTime,
			orderStatus: orderStatus._id
		});
		await order.save();

		const orderProducts = await OrderProduct.find({
			active: true,
			customer: req.user.id
		})
			.lean()
			.exec();

		const orderProductsIds = orderProducts.map((product) => {
			return product._id;
		});

		await OrderProduct.updateMany(
			{ _id: orderProductsIds },
			{ order: order._id, active: false, ordered: true }
		)
			.lean()
			.exec();

		order = await Order.findByIdAndUpdate(
			order._id,
			{ $push: { orderProducts: orderProductsIds } },
			{ new: true }
		)
			.lean()
			.exec();

		sendMailToCustomer(req.user.email);

		res.redirect('./dashboard');
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.getOrders = async (req, res) => {
	try {
		const orders = await Order.find({ customer: req.user.id }, '-__v -customer')
			.populate({
				path: 'paymentType orderStatus restaurant orderReview',
				populate: {
					path: 'restaurantType',
					select: '-__v -active'
				},
				select: '-__v -active -admin'
			})
			.populate({
				path: 'orderProducts',
				populate: {
					path: 'product',
					populate: {
						path: 'menu',
						select: '-__v -active'
					},
					select: '-__v -active -price -restaurant'
				},
				select: '-__v -active -customer -order -ordered'
			})
			.lean()
			.exec();

		res.render('./customer/orders', { orders });
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.reviewOrder = async (req, res) => {
	try {
		const orderReview = new OrderReview({
			comment: req.body.comment,
			rating: req.body.rating
		});

		await orderReview.save();

		await Order.findByIdAndUpdate(req.params.id, { orderReview: orderReview }).lean().exec();

		res.redirect(303, 'back');
	} catch (err) {
		console.log(err);
		res.status(404).send(err);
	}
};
