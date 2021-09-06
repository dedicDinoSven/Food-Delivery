const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = require('./Location').LocationSchema;

const RestaurantSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	restaurantType: {
		type: Schema.Types.ObjectId,
		ref: 'RestaurantType',
		required: true,
	},
    location: LocationSchema,
    workingHoursStart: {
        type: String,
        required: true
    },
    workingHoursEnd: {
        type: String,
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        sparse: true
    },
    deliveryDistance: Number,
    active: {
        type: Boolean,
        default: true
    }
});

RestaurantSchema.pre('save', function (next) {
	this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
	next();
});

RestaurantSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;