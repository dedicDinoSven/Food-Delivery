const User = require('../models/User');
const Location = require('../models/Location').Location;
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
const MenuType = require('../models/MenuType');
const OrderProduct = require('../models/OrderProduct');
const PaymentType = require('../models/PaymentType');
const OrderStatus = require('../models/OrderStatus');
const Order = require('../models/Order');

const { sendMailToCustomer } = require('../middleware/nodemailer');
const webpush = require('web-push');

webpush.setGCMAPIKey('AAAAYerr1d8:APA91bGBRezpjDxq2MAjvZX9_c3au1uk705tq9BRQI3FZCegFoJnlplueQwHUTcecrI55ZWaDz0q5VokymuIzk6y_lzTU83n1Lt2d9aLUg8841w-raZM8eFHXopejH-_x9GeIxiGIF-T');
webpush.setVapidDetails(
	'mailto:fooddelivery19597@hotmail.com',
	process.env.PUBLIC_VAPID_KEY,
	process.env.PRIVATE_VAPID_KEY
);

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

		const menu = await MenuType.findOne({
			name: { $regex: regex },
			active: true
		})
			.lean()
			.exec();

		const products = await Product.find({ menu: menu._id, active: true })
			.populate('menu', '-__v')
			.populate('restaurant', '-__v -admin -courier')
			.lean()
			.exec();

		res.render('./customer/productSearchResults', { products });
	} catch (err) {
		res.status(404).send(err);
	}
};

exports.getRestaurant = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(
			req.params.id,
			'-__v -admin -courier'
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

		const order = new Order({
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
			
		sendMailToCustomer(req.user.email);
		
		res.redirect('./dashboard');
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.getOrders = async (req, res) => {
	try {
		const orders = await OrderProduct.find(
			{ customer: req.user.id },
			'-__v -customer -active -price'
		)
			.populate({
				path: 'product',
				populate: {
					path: 'menu restaurant',
					populate: {
						path: 'restaurantType', 
						select: '-__v -active'
					},
					select: '-__v -admin -courier -active'
				},
				select: '-__v -active'
			})
			.populate({
				path: 'order',
				populate: {
					path: 'paymentType orderStatus',
					select: '-__v -active'
				},
				select: '-__v -customer -restaurant'
			})
			.lean()
			.exec();

		console.log(orders);
		res.render('./customer/orders', { orders });
	} catch (err) {
		res.status(400).send(err);
	}
};
