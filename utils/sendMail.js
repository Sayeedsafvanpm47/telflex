const nodemailer = require("nodemailer");
const { isEmailValid } = require("../utils/validators/signUpValidator");

async function sendOTPByEmail(email, otp) {
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
		from: "Telflex<sydsfn123@gmail.com>",
		to: email,
		subject: "Sending email",
		text: `Otp for login to your account ${otp}`
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

module.exports = sendOTPByEmail;
	
