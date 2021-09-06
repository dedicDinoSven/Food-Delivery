const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderReviewSchema = new Schema({
	comment: {
		type: String,
		required: true,
	},
    rating: {
        type: Number,
        required: true
    }
});

const OrderReview = mongoose.model('OrderReview', OrderReviewSchema);

module.exports = OrderReview;
