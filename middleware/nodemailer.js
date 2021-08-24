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
			text: 'We received your order successfully'
		});

		console.log(`Message sent: ${mailStatus.messageId}`);
		return `Message sent: ${mailStatus.messageId}`;
	} catch (err) {
		console.log(err.message);
	}
}
