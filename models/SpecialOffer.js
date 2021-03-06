const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpecialOfferSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	photoUrl: {
		type: String,
		unique: true,
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
	restaurant: {
		type: Schema.Types.ObjectId,
		ref: 'Restaurant',
		required: true,
	},
	dateFrom: {
		type: Date,
		default: Date.now,
	},
	dateTo: {
		type: Date,
		default: Date.now,
	},
	timeFrom: {
		type: String,
		required: true
	},
	timeTo: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
});

SpecialOfferSchema.pre('save', function (next) {
	this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);

	next();
});

SpecialOfferSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const SpecialOffer = mongoose.model('SpecialOffer', SpecialOfferSchema);

module.exports = SpecialOffer;
