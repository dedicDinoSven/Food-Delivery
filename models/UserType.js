const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTypeSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

const UserType = mongoose.model('UserType', UserTypeSchema);

module.exports = UserType;
