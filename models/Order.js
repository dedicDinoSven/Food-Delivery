const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	restaurant: {
		type: Schema.Types.ObjectId,
		ref: 'Restaurant',
		required: true
	},
	customer: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	courier: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	paymentType: {
		type: Schema.Types.ObjectId,
		ref: 'PaymentType',
		required: true
	},
	comment: String,
	orderTime: {
		type: String,
		required: true
	},
	orderDate: {
		type: Date,
		default: Date.now
	},
	price: {
		type: Number,
		required: true
	},
	orderStatus: {
		type: Schema.Types.ObjectId,
		ref: 'OrderStatus',
		required: true
	}
});

OrderSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
