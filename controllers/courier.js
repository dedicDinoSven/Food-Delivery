const { format, startOfDay, endOfDay } = require('date-fns');

const User = require('../models/User');
const Location = require('../models/Location').Location;
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
const MenuType = require('../models/MenuType');
const OrderProduct = require('../models/OrderProduct');
const PaymentType = require('../models/PaymentType');
const OrderStatus = require('../models/OrderStatus');
const Order = require('../models/Order');

exports.getDashboard = async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.populate('userType', '-__v -active')
			.lean()
			.exec();

		const orders = await Order.find(
			{
				courier: user._id,
				orderDate: {
					$gte: format(startOfDay(new Date()), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
					$lte: format(endOfDay(new Date()), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
				}
			},
			'-__v'
		)
			.populate('restaurant', '-__v -admin -courier')
			.populate('customer', '-__v -active -password -userType -dateJoined')
			.populate('paymentType', '-__v -active')
			.populate('orderStatus', '-__v -active')
			.lean()
			.exec();

		const ordersIds = orders.map((order) => {
			return order._id;
		});

		const orderProducts = await OrderProduct.find(
			{ order: { $in: ordersIds } },
			'-__v -customer -ordered -active'
		)
			.populate('product', '-__v -price -active -restaurant -menu')
			.lean()
			.exec();

		res.render('./courier/dashboard', {
			orders,
			orderProducts,
			user
		});
	} catch (err) {
		console.log(err);
		res.status(404).send(err);
	}
};

exports.deliverOrder = async (req, res) => {
	try {
		const orderStatus = await OrderStatus.findOne({ name: 'Delivered' })
			.lean()
			.exec();

		await Order.findByIdAndUpdate(
			req.params.id,
			{ orderStatus: orderStatus._id },
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
