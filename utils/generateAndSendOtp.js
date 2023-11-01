const sendOTPByEmail = require("../utils/sendMail");
const otpGenerator = require("../utils/otpGenerator");
const userModel = require("../models/userModel");

async function generateAndSendOTP(email) {
	const user = await userModel.findOne({ email });
	if (user) {
		const otp = await otpGenerator.generateOTP();
		console.log(otp);
		user.otp = otp;
		user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
		user.otpAttempts = 0;
		await user.save();

		try {
			const emailResponse = await sendOTPByEmail(email, otp);
			console.log("Email sent successfully:", emailResponse);
		} catch (error) {
			console.error("Error sending email:", error);
		}
	}
}
module.exports = generateAndSendOTP;
