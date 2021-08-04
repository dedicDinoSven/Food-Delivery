const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
	menuType: {
        type: Schema.Type.ObjectId,
        ref: "MenuType",
        required: true
    },
    restaurant: {
        type: Schema.Type.ObjectId,
        ref: "Restaurant",
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

MenuSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;
