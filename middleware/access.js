const UserType = require('../models/UserType');

exports.superAdmin = async (req, res, next) => {
	try {
		const type = await UserType.findOne({ name: 'SuperAdmin' }).lean().exec();

		if (type._id.toString() === req.user.userType) {
			return next();
		}

		return res.status(403).send('Unauthorized');
	} catch (err) {
		console.log(err);
	}
};

exports.admin = async (req, res, next) => {
	try {
		const type = await UserType.findOne({ name: 'Admin' }).lean().exec();

		if (type._id.toString() === req.user.userType) {
			return next();
		}

		return res.status(403).send('Unauthorized');
	} catch (err) {
		console.log(err);
	}
};

exports.courier = async (req, res, next) => {
	try {
		const type = await UserType.findOne({ name: 'Courier' }).lean().exec();

		if (type._id.toString() === req.user.userType) {
			return next();
		}

		return res.status(403).send('Unauthorized');
	} catch (err) {
		console.log(err);
	}
};

exports.customer = async (req, res, next) => {
	try {
		const type = await UserType.findOne({ name: 'Customer' }).lean().exec();

		if (type._id.toString() === req.user.userType) {
			return next();
		} 

		return res.status(403).send('Unauthorized');
	} catch (err) {
		console.log(err);
	}
};

exports.chat = async (req, res, next) => {
	try {
		const superAdmin = await UserType.findOne({ name: 'SuperAdmin' })
			.lean()
			.exec();
		const admin = await UserType.findOne({ name: 'Admin' }).lean().exec();

		if (
			superAdmin._id.toString() === req.user.userType ||
			admin._id.toString() === req.user.userType
		) {
			return next();
		}

		return res.status(403).send('Unauthorized');
	} catch (err) {
		console.log(err);
	}
};
