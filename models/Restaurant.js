const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = require('./Location').LocationSchema;

const RestaurantSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	location: LocationSchema,
	restaurantType: {
		type: Schema.Types.ObjectId,
		ref: 'RestaurantType',
		required: true,
	},
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    courier: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    workTime: {
        type: String,
        required: true,
    },
    deliveryDistance: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
    // rating
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