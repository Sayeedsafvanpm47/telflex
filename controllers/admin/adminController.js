const userModel = require("../../models/userModel");
const sendOTPByEmail = require("../../utils/sendMail");
const bcrypt = require("bcrypt");
const otpGenerator = require("../../utils/otpGenerator");
const sendOtp = require("../../utils/generateAndSendOtp");
const { isEmailValid, isPasswordValid } = require("../../utils/validators/signUpValidator");
module.exports = {
	getAdminLogin: async (req, res) => {
		await res.render("admin/login");
	},
	postAdminLogin: async (req, res) => {
		const { email, password } = req.body;
		const errors = [];

		// Validation checks
		if (!email) {
			errors.push("Enter an email");
		}

		if (!password) {
			errors.push("Enter a password");
		}

		if (errors.length > 0) {
			return res.render("admin/login", { errors });
		}

		try {
			const user = await userModel.findOne({ email });
			if (user) {
				const passCheck = await bcrypt.compare(password, user.password);
				if (user.isAdmin === true && passCheck) {
					console.log(user.isAdmin);
					res.send("Welcome admin");
				} else {
					errors.push("Invalid credentials");
					res.render("admin/login", { errors });
				}
			} else {
				errors.push("User not found");
				res.render("admin/login", { errors });
			}
		} catch (err) {
			console.error(err);
			res.status(500).send("Internal Server Error");
		}
	},
	verifyOtp: async (req, res) => {
		const { email, enteredOTP } = req.body;
		const user = await userModel.findOne({ email });
		if (!user || !user.otp || user.otpExpires <= new Date() || user.otpAttempts >= 3) {
			res.send("OTP verification failed");
		}
		if (user.otp === enteredOTP) {
			user.otp = null;
			user.otpExpires = null;
			user.otpAttempts = 0;
			await user.save();

			await res.render("admin/createPass", { email: email });
		} else {
			user.otpAttempts += 1;
			await user.save();
			res.send("Invalid OTP");
		}
	},
	resendOtp: async (req, res) => {
		const { email } = req.body;
		await sendOtp(email);
		res.render("admin/verify-otp", { email: email });
	},
	getForgotPassAdmin: async (req, res) => {
		await res.render("admin/forgotPassword");
	},
	postForgotPassAdmin: async (req, res) => {
		try {
			const { email } = req.body;
			const user = await userModel.findOne({ email });

			if (!user) {
				return res.send("User not found");
			}

			if (user.isAdmin === true) {
				// If user is an admin, proceed with OTP sending and rendering the verification page
				await sendOtp(email);
				res.render("admin/verify-otp", { email: email });
			} else {
				res.send("User is not an admin");
			}
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal Server Error");
		}
	},
	updatePass: async (req, res) => {
		const { password, chkpassword, email } = req.body;
		const user = await userModel.findOne({ email });

		if (password === chkpassword) {
			try {
				const hashedPass = await bcrypt.hash(password, 10);
				user.password = hashedPass;
				await user.save();

				res.send("welcome admin");
			} catch (error) {
				console.error("Error updating password:", error);
				res.redirect("/admin/");
			}
		} else {
			res.redirect("/admin/");
		}
	}
};
