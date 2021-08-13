const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantTypeSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
});

const RestaurantType = mongoose.model('RestaurantType', RestaurantTypeSchema);

module.exports = RestaurantType;
