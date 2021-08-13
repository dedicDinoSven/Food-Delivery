const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuTypeSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
    active: {
        type: Boolean,
        default: true
    }
});

const MenuType = mongoose.model('MenuType', MenuTypeSchema);

module.exports = MenuType;
