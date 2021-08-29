const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
	host: 'smtp-relay.sendinblue.com',
	port: 587,
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS
	}
});

exports.sendMailToCustomer = async (email) => {
	try {
		let mailStatus = await transporter.sendMail({
			from: '"No reply @ Food Delivery" <fooddelivery19597@hotmail.com>',
			to: email,
			subject: 'Order received',
			text: 'We received your order successfully',
			html: '<p>We received your order successfully</p>'
		});

		console.log(`Message sent: ${mailStatus.messageId}`);
		return `Message sent: ${mailStatus.messageId}`;
	} catch (err) {
		console.log(err.message);
	}
};

exports.sendMailToAdmin = async (email, days, month, courier) => {
	try {
		let mailStatus = await transporter.sendMail({
			from: '"No reply @ Food Delivery" <fooddelivery19597@hotmail.com>',
			to: email,
			subject: `Report for ${month[0]._id.month}.${month[0]._id.year}`,
			html: `<p>Orders by dates: ${JSON.stringify(days.ordersByDay)}.</p><br/>
			<p>Total number of received orders for this month is ${month[0].count}.</p><br/>
				<p>Our courier delivered ${courier} orders.</p>`
		});

		console.log(`Message sent: ${mailStatus.messageId}`);
		return `Message sent: ${mailStatus.messageId}`;
	} catch (err) {
		console.log(err.message);
	}
};

exports.sendMailToSuperAdmin = async (email, report) => {
	try {
		let mailStatus = await transporter.sendMail({
			from: '"No reply @ Food Delivery" <fooddelivery19597@hotmail.com>',
			to: email,
			subject: `Report for all restaurants`,
			html: `${JSON.stringify(report)}`
		});

		console.log(`Message sent: ${mailStatus.messageId}`);
		return `Message sent: ${mailStatus.messageId}`;
	} catch (err) {
		console.log(err.message);
	}
};
