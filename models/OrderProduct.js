const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderProductSchema = new Schema({
	order: {
		type: Schema.Types.ObjectId,
		ref: 'Order'
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
	},
	offer: {
		type: Schema.Types.ObjectId,
		ref: 'SpecialOffer'
	},
	price: {
		type: Number,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
	fullPrice: {
		type: Number,
		required: true
	},
	customer: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	ordered: {
		type: Boolean,
		default: false
	},
	active: {
		type: Boolean,
		default: true
	}
});

OrderProductSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const OrderProduct = mongoose.model('OrderProduct', OrderProductSchema);

module.exports = OrderProduct;
