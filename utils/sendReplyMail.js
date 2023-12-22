const nodemailer = require("nodemailer");
const { isEmailValid } = require("../utils/validators/signUpValidator");


async function sendreplyByEmail(email, reply) {
	if (!isEmailValid(email)) {
		return Promise.reject("Invalid email. Please enter a valid email address.");
	}

	const transporter = nodemailer.createTransport({
		service: "gmail", 
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS
		}
	});

	const mailOptions = {
		from: "Telflex<sayeedportfolio47@gmail.com>",
		to: email,
		subject: "Sending reply for the query",
		text: `We have recieved your enquiry, please go through this reponse mail :  ${reply}`
	};

	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				reject(error);
			} else {
				resolve(info.response);
			}
		});
	});
}


module.exports = sendreplyByEmail;
