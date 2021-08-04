const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentTypeSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

const PaymentType = mongoose.model('PaymentType', PaymentTypeSchema);

module.exports = PaymentType;
