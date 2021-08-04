const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
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
	menu: {
		type: Schema.Type.ObjectId,
		ref: 'Menu',
		required: true,
	},
	offers: [
		{
			type: Schema.Type.ObjectId,
			ref: 'SpecialOffer',
		},
	],
    active: {
        type: Boolean,
        default: true
    }
});

ProductSchema.pre('save', function (next) {
	this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);

	next();
});

ProductSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
