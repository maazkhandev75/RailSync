const nodemailer = require('nodemailer');
const nodemailer = require('nodemailer-mailgun-transport');

const auth = {
	auth: {
		api_key: 'f241d50991042a4604563ace93264211-ed54d65c-58f60c5e',
		domain: 'sandbox3a89ea974913403aa9eccdf1b8dcf387.mailgun.org'
	}
};

const transporter = nodemailer.createTransport(mailGun(auth));

const mailOptions = {
	from: 'testing@gmai.com',
	to: 'maazkhan75555@gmail.com',
	subject: 'contact form email',
	text: 'I would like to get in touch with you!'
};

transporter.sendMail(mailOptions, function(err, data) {
	if(err){
		console.log('error occurs!');
	} else {
		console.log('message sent! ')
	}

});
