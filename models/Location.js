const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
	lat:{ 
		type: String,
		required: true
	 },
	lng: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	streetNum: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	
});

LocationSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = { Location, LocationSchema };