const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestSchema = new Schema({
	lat: String,
	lng: String,
	formattedAddress: {
		type: String,
	},
	address: {
		type: String,
	},
	streetNum: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Rest', RestSchema);
