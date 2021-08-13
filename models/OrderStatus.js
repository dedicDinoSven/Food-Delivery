const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderStatusSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
});

const OrderStatus = mongoose.model('OrderStatus', OrderStatusSchema);

module.exports = OrderStatus;
