const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderProductsSchema = new Schema({
	order: {
		type: Schema.Types.ObjectId,
		ref: 'Order',
		required: true,
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
	},
	offer: {
		type: Schema.Types.ObjectId,
		ref: 'SpecialOffer',
	},
	quantity: {
		type: Number,
		required: true,
	},
	fullPrice: {
		type: Number,
		required: true,
	},
});

OrderProductsSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const OrderProducts = mongoose.model('OrderProducts', OrderProductsSchema);

module.exports = OrderProducts;
