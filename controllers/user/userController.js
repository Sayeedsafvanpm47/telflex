const userModel = require("../../models/userModel");
const sendOTPByEmail = require("../../utils/sendMail");
const bcrypt = require("bcrypt");
const { isEmailValid, isPasswordValid, isNamesValid, isPhoneValid, isCpassValid } = require("../../utils/validators/signUpValidator");
const otpGenerator = require("../../utils/otpGenerator");
const sendOtp = require("../../utils/generateAndSendOtp");

module.exports = {
	getLogin: async (req, res) => {
		try {
			await res.render("user/user/login");
		} catch (err) {
			res.status(200).send("error occured");
		}
	},
	postLogin: async (req, res) => {
		try {
		  const { email, password } = req.body;
		  const emailValid = isEmailValid(email);
		  const passwordValid = isPasswordValid(password);
		  const user = await userModel.findOne({ email });
		  let errors = [];
	        
		  if (!email || !password) {
		    errors.push('Please fill out all fields');
		  }
	        
		  if (!emailValid) {
		    errors.push("Invalid email");
		  }
		  if (!passwordValid) {
		    errors.push("Invalid password");
		  }
		  if (!user) {
		    console.log("User not found");
		    errors.push("Account doesn't exist");
		  } else if (user.isBlocked === true) {
		    console.log("User is Blocked");
		    errors.push("This user is blocked");
		  }
	        
		  if (errors.length > 0) {
		    res.render("user/user/login", { errors });
		  } else {
		    const passwordMatch = await bcrypt.compare(password, user.password);
		    if (passwordMatch) {
		      console.log("Login successful");
		      res.redirect("/user/getHome");
		    } else {
		      console.log("Invalid password");
		      res.redirect("/user/");
		    }
		  }
		} catch (err) {
		  console.error("Error in catch:", err);
		  res.redirect("/user");
		}
	        },
	        
	getHome: async (req, res) => {
		await res.render("user/index.ejs");
	},
	getSignUp: async (req, res) => {
		try {
			await res.render("user/user/register");
		} catch (err) {}
	},
	postSignUp: async (req, res) => {
		try {
			const { email, password, firstname, lastname, phonenumber, chkpassword } = req.body;
			const emailValid = isEmailValid(email);
			const passwordValid = isPasswordValid(password);
			const namesValid = isNamesValid(firstname, lastname);
			const phoneValid = isPhoneValid(phonenumber);
			const cpassValid = isCpassValid(password, chkpassword);
			const emailCheck = await userModel.findOne({ email });
			let errors = [];
			if(!email || !password || !firstname || !lastname || !phonenumber || !chkpassword)
			{
				errors.push('fill details properly')
			}

			if (emailCheck) {
				errors.push("Email exists");
			}
			if (!emailValid) {
				errors.push("Invalid email. Please enter a valid email address.");
			}
			if (!passwordValid) {
				errors.push("Invalid password. Please enter password with atleast 8 charecters.");
			}
			if (!namesValid) {
				errors.push("Fill in your details correctly");
			}
			if (!phoneValid) {
				errors.push("Enter your contact number correctly");
			}
			if (!cpassValid) {
				errors.push("Password doesnt match");
			}
			if (errors.length > 0) {
				res.render("user/user/register", { errors });
			}

			if (emailValid && passwordValid && namesValid && phoneValid && cpassValid) {
				const hashedPassword = await bcrypt.hash(password, 10);
				const user = new userModel({
					email,
					password: hashedPassword,
					firstname,
					lastname,
					phonenumber
				});
				const otp = await otpGenerator.generateOTP();

				console.log(otp);

				user.otp = otp;
				user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
				user.otpAttempts = 0;
				await user.save();
				try {
					const emailResponse = await sendOTPByEmail(email, user.otp);
					console.log("Email sent successfully:", emailResponse);
				} catch (error) {
					console.error("Error sending email:", error);
				}
				req.session.isLogin = true;
				res.render("user/user/otpVerify", { email: email });
			}
		} catch (err) {
			console.error("Error:", err);
			res.send("error");
		}
	},

	verifyOTP: async (req, res) => {
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
			if (req.session.isLogin) {
				
				await res.redirect("/user/getHome");
			}
			if (req.session.isForgot) {
				await res.render("user/user/createPass", { email: email });
			}
		} else {
			user.otpAttempts += 1;
			await user.save();
			res.send("Invalid OTP");
		}
	},

	resendOtp: async (req, res) => {
		const { email } = req.body;
		await sendOtp(email);
		res.render("user/user/otpVerify", { email: email });
	},
	getForgotPassword: async (req, res) => {
		res.render("user/user/forgotPassword");
	},
	forgotPassword: async (req, res) => {
		const { email } = req.body;
		await sendOtp(email);
		req.session.isForgot = true;
		res.render("user/user/otpVerify", { email: email });
	},

	updatePass: async (req, res) => {
		const { password, chkpassword, email } = req.body;
		const user = await userModel.findOne({ email });
                    const errors = []
		if (password === chkpassword) {
			try {
				const hashedPass = await bcrypt.hash(password, 10);
				user.password = hashedPass;
				await user.save();

				// Wait for the password update to complete before redirecting
				res.redirect("/user/getsignup");
			} catch (error) {
				console.error("Error updating password:", error);
				res.redirect("/user/"); // Handle the error as needed
			}
		} else {
			errors.push('password mismatch')
			res.render('user/user/otpVerify',{errors,email})
		}
	}
};
