const userModel = require("../../models/userModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const refferalModel = require("../../models/refferalModel");
const wishlistModel = require("../../models/wishlist");
const bannerModel = require("../../models/bannerModel");
const cartModel = require("../../models/cartModel");
const categoryModel = require("../../models/categoryModel");
const messageModel = require("../../models/messageModel");
const sendOTPByEmail = require("../../utils/sendMail");
const bcrypt = require("bcrypt");
const { isEmailValid, isPasswordValid, isNamesValid, isPhoneValid, isCpassValid } = require("../../utils/validators/signUpValidator");
const otpGenerator = require("../../utils/otpGenerator");
const sendOtp = require("../../utils/generateAndSendOtp");
const mongoose = require("mongoose");
const { checkReturnExpiry } = require("../../helpers/cronJob");
const { USER } = require("../../utils/constants/schemaName");

module.exports = {
	// controller logic for getting the login page, i hava handled the error rendering using sweet alerts here.
	getLogin: async (req, res) => {
		try {
			let errors;
			let success;
			if (!req.session.userId) {
				if (req.session.errorWhileLogin) {
					errors = req.session.errors;
					delete req.session.errorWhileLogin;
					await res.render("user/user/login", { errors, success });
				} else if (req.session.registrationOk) {
					success = "Succesfully registered";
					delete req.session.registrationOk;
					await res.render("user/user/login", { errors, success });
				} else {
					await res.render("user/user/login", { errors, success });
				}
			} else {
				await res.redirect("/");
			}
		} catch (err) {
			res.redirect("/user/error");
		}
	},
	// controller logic for posting the login data to get into home, if all the validations are passed it will take you to shop page
	postLogin: async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const emailValid = isEmailValid(email);
			const passwordValid = isPasswordValid(password);
			const user = await userModel.findOne({ email: email });
			let errors;

			if (!email || !password) {
				errors = "Please fill out all fields";
			}

			if (!emailValid) {
				errors = "Invalid email";
			}
			if (!passwordValid) {
				errors = "Invalid password";
			}
			if (!user) {
				console.log("User not found");
				errors = "Account does not exist";
			}
			if (user) {
				if (user.otp !== null) {
					errors = "User account has not been verified yet";
				}

				if (user.isBlocked == true) {
					errors = "The user is blocked";
				}
			}

			if (errors) {
				req.session.errors = errors;
				req.session.errorWhileLogin = true;
				res.redirect("/user/shop");
			} else {
				const passwordMatch = await bcrypt.compare(password, user.password);
				if (passwordMatch) {
					req.session.userId = user._id;
					req.session.user = true;

					console.log(req.session.userId);
					console.log("Login successful");
					if (req.session.cart) {
						res.redirect("/user/showCart");
					} else {
						req.session.loginSuccess = true;
						if (user.isAdmin === true) {
							req.session.admin = true;
							req.session.adminId = req.session.userId;
							res.redirect("/admin/home");
						} else {
							res.redirect("/user/home");
						}
					}
				} else {
					console.log("Invalid password");

					const error = new Error("No user data available");
					error.status = 400;
					error.isRestCall = true;
					throw error;
				}
			}
		} catch (err) {
			console.error("Error in catch:", err);
			next(err);
		}
	},

	// controller logic for rendering the home page is shown here, in this i have the banners, new products, featured products etc
	homepage: async (req, res) => {
		try {
			const products = await productModel.find({});
			if (products) {
				const banners = await bannerModel.findOne({ bannerType: "Main Banner" });
				const subbanner = await bannerModel.findOne({ bannerType: "Sub Banner" });
				const deals = await bannerModel.findOne({ bannerType: "Deals banner" });
				const offer = await bannerModel.findOne({ bannerType: "Offer Banner" });
				const fest = (await bannerModel.findOne({ bannerType: "Festival Banner" })) || "";
				const about = await bannerModel.findOne({ bannerType: "About Banner" });
				let success;

				const newproducts = await productModel
					.find({})
					.populate({
						path: "category",
						model: "categories",
						select: "categoryName"
					})
					.sort({ CreatedOn: 1 })
					.limit(8);

				const newarrivals = await productModel
					.find({})
					.populate({
						path: "category",
						model: "categories",
						select: "categoryName _id"
					})
					.sort({ CreatedOn: 1 })
					.limit(12);

				const featured = await productModel
					.find({ featured: "Yes" })
					.populate({
						path: "category",
						model: "categories",
						select: "categoryName _id"
					})
					.sort({ CreatedOn: 1 })
					.limit(8);

				const categoryId = await categoryModel.aggregate([{ $group: { _id: "$_id" } }]);
				console.log("this is categoryId");
				console.log(categoryId);
				console.log(banners);
				if (req.session.loginSuccess) {
					success = "Succesfully Logged In";
					delete req.session.loginSuccess;
				}
				res.render("user/user/home", {
					products,
					banners,
					subbanner,
					newproducts,
					newarrivals,
					deals,
					offer,
					fest,
					about,
					categoryId,
					featured,
					success
				});
			} else {
				console.log("products not found");
				const error = new Error("No Products Found");
				error.status = 400;
				error.isRestCall = true;
				throw error;
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	},
	// this is the controller logic for about page
	getAbout: async (req, res) => {
		try {
			const banners = await bannerModel.findOne({ bannerType: "Main About Banner" });
			const manufacturing = await bannerModel.findOne({ bannerType: "manufacturing" });
			const factory = await bannerModel.findOne({ bannerType: "factory" });
			if (banners) {
				res.render("user/user/about", { banners, manufacturing, factory });
			} else {
				console.log("about page fetching failed");
				const error = new Error("No data available for this page");
				error.status = 400;
				error.isRestCall = true;
				throw error;
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	},
	// this is the controller for dealers page, and this has a banner and i have handled the error handling here
	getDealers: async (req, res) => {
		try {
			const banners = await bannerModel.findOne({ bannerType: "Dealer Banner" });
			if (banners) {
				res.render("user/user/dealer", { banners });
			} else {
				console.log("dealer page fetching failed");
				const error = new Error("No data available for this page");
				error.status = 400;
				error.isRestCall = true;
				throw error;
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	},
	// this is the page for contact form, this page also has a map, contact us form, etc
	getContact: async (req, res) => {
		try {
			const banners = await bannerModel.findOne({ bannerType: "Contact Banner" });
			if (banners) {
				res.render("user/user/contact", { banners });
			} else {
				console.log("contact page fetching failed");
				const error = new Error("No data available for this page");
				error.status = 400;
				error.isRestCall = true;
				throw error;
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	},
	// page for rendering the signup
	getSignUp: async (req, res) => {
		try {
			let errors;
			if (!req.session.userId) {
				if (req.session.errorWhileSignup) {
					errors = req.session.errors;
					delete req.session.errorWhileSignup;
					await res.render("user/user/register", { errors });
				} else {
					await res.render("user/user/register", { errors });
				}
			} else {
				await res.redirect("/");
			}
		} catch (err) {
			console.log(err);
			res.redirect("/user/error");
		}
	},
	// controller for posting the signup
	postSignUp: async (req, res) => {
		try {
			const { email, password, firstname, lastname, phonenumber, chkpassword, refferal } = req.body;
			const emailValid = isEmailValid(email);
			const passwordValid = isPasswordValid(password);
			const namesValid = isNamesValid(firstname, lastname);
			const phoneValid = isPhoneValid(phonenumber);
			const cpassValid = isCpassValid(password, chkpassword);
			const emailCheck = await userModel.findOne({ email });
			console.log(emailCheck);

			let errors;
			if (!email || !password || !firstname || !lastname || !phonenumber || !chkpassword) {
				errors = "fill details properly";
			}
			let refferalok = false;
			let reffereeId;
			const checkRefferal = await refferalModel.find({});
			checkRefferal.forEach((item) => {
				if (item.refferalCode === refferal) {
					refferalok = true;
					reffereeId = item.reffererId;
				}
			});
			console.log(refferalok);
			console.log(reffereeId);
			if (refferalok) {
				req.session.refferalDoneCheck = true;
				req.session.reffereeId = reffereeId;
			}
			if (emailCheck) {
				if (emailCheck.isVerified) {
					errors = "email already exists";
				}

				if (emailCheck.isVerified == false) {
					console.log(emailCheck);
					await userModel.findByIdAndDelete(emailCheck._id);
				}
			}

			if (!emailValid) {
				errors = "Invalid email. Please enter a valid email address.";
			}
			if (!passwordValid) {
				errors = "Invalid password. Please enter password with atleast 8 charecters.";
			}
			if (!namesValid) {
				errors = "Fill in your details correctly";
			}
			if (!phoneValid) {
				errors = "Enter your contact number correctly";
			}
			if (!cpassValid) {
				errors = "Password doesnt match";
			}
			if (errors && errors !== null) {
				req.session.errors = errors;
				req.session.errorWhileSignup = true;
				res.redirect("/user/getsignup");
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
				user.otpExpires = new Date(Date.now() + 2 * 60 * 1000);
				user.otpAttempts = 0;
				await user.save();

				try {
					const emailResponse = await sendOTPByEmail(email, user.otp);
					console.log("Email sent successfully:", emailResponse);
				} catch (error) {
					console.error("Error sending email:", error);
				}
			}
			if (!req.session.errorWhileSignup) {
				req.session.isLogin = true;
				req.session.email = email;
				res.redirect("/user/showOtp");
			}
		} catch (err) {
			console.error("Error:", err);
		}
	},
	// controller for otp verification

	verifyOTP: async (req, res) => {
		try {
			const { email, enteredOTP } = req.body;
			const errors = [];
			let reffereeId;
			let wallet = 0;
			let reffered = false;
			if (req.session.refferalDoneCheck) {
				reffereeId = req.session.reffereeId;
				wallet = 100;
				reffered = true;
				delete req.session.refferalDoneCheck;
			}
			const updateUserWallet = await userModel.updateOne({ _id: reffereeId }, { $inc: { wallet: 100 } });
			console.log(reffereeId);
			const user = await userModel.findOne({ email });
			if (!user || !user.otp || user.otpExpires <= new Date() || user.otpAttempts >= 3) {
				errors.push("verification failed, try again..., or request for another otp");

				return res.render("user/user/otpVerify", { errors, email: email });
			}
			if (user.otp == enteredOTP) {
				user.otp = null;
				user.otpExpires = null;
				user.otpAttempts = 0;
				user.isVerified = true;
				user.wallet = wallet;
				user.reffered = reffered;
				await user.save();
				if (req.session.loginOk) {
					const userDetails = await userModel.findOne({ email: email });
					console.log(userDetails);
					const refferalCode = userDetails.refferalCode;
					console.log(refferalCode);
					console.log(refferalCode);
					const _id = userDetails._id;
					const refferal = new refferalModel({
						refferalCode: refferalCode,
						reffererId: _id
					});
					await refferal.save();
					delete req.session.loginOk;
					req.session.registrationOk = true;
					await res.redirect("/user/shop");
				} else if (req.session.forgotOk) {
					req.session.email = email;
					req.session.createPass = true;
					delete req.session.forgotOk;

					await res.redirect("/user/showCreatePass");
				}
			} else {
				user.otpAttempts += 1;
				attempts = 3 - user.otpAttempts;
				await user.save();

				errors.push(attempts + "attempts left");

				return res.render("user/user/otpVerify", { errors, email: email });
			}
		} catch (err) {
			console.log(err);
			res.redirect("/user/error");
		}
	},
	// controller for showCreatePassword

	showCreatePass: async (req, res) => {
		try {
			let errors = [];
			if (req.session.createPass) {
				const email = req.session.email;
				delete req.session.createPass;
				delete req.session.email;
				await res.render("user/user/createPass", { email: email });
			} else {
				errors.push("Failed updating the password, please try again");
				await res.render("user/user/forgotPassword", { errors });
			}
		} catch (error) {
			console.log(error);

			await res.redirect("/user/getForgotPassword");
		}
	},

	// controller for resend otp
	resendOtp: async (req, res) => {
		try {
			const { email } = req.body;
			await sendOtp(email);
			req.session.isForgot = true;
			req.session.email = email;
			res.redirect("/user/showOtp");
		} catch (error) {
			console.log(error);
			res.redirect("/");
		}
	},
	// controller for getting forgot password
	getForgotPassword: async (req, res) => {
		try {
			if (req.session.forgotError) {
				let errors = [];
				errors.push("corrupt credentials or fill in details properly");
				res.render("user/user/forgotPassword", { errors });
			} else {
				res.render("user/user/forgotPassword");
			}
		} catch (error) {
			res.redirect("/user/error");
		}
	},
	// controller for user logout
	logout: async (req, res) => {
		try {
			delete req.session.userId;
			res.redirect("/");
		} catch (error) {
			console.log(error);
			res.redirect("/user/error");
		}
	},
	// controller for forgot password
	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body;

			const emailExist = await userModel.findOne({ email: email });
			if (emailExist) {
				console.log("email exist");
			} else {
				console.log("doesnt exist");
			}

			if (!emailExist) {
				req.session.forgotError = true;
				res.redirect("/user/getForgotPassword");
			} else {
				console.log("in this block");
				await sendOtp(email);

				req.session.isForgot = true;
				req.session.email = email;

				console.log("user forgot the pass");
				res.redirect("/user/showOtp");
			}
		} catch (error) {
			console.log(error);
			res.redirect("/");
		}
	},
	// controller for showOtp
	showOtp: async (req, res) => {
		try {
			const errors = [];

			if (req.session.isForgot) {
				const email = req.session.email;
				delete req.session.isForgot;

				req.session.forgotOk = true;

				res.render("user/user/otpVerify", { email: email });
			} else if (req.session.isLogin) {
				const email = req.session.email;
				delete req.session.isLogin;

				req.session.loginOk = true;
				res.render("user/user/otpVerify", { email: email });
			} else {
				if (req.session.forgotOk) {
					errors.push("otp verification failed, request again");
					res.render("user/user/forgotPassword", { errors });
				} else if (req.session.loginOk) {
					errors.push("otp verification failed, request again");
					res.render("user/user/register", { errors });
				}
			}
		} catch (error) {
			res.redirect("/user/getForgotPassword");
		}
	},
	// controller for updating password
	updatePass: async (req, res) => {
		const { password, chkpassword, email } = req.body;
		const user = await userModel.findOne({ email });
		const errors = [];

		if (password.length > 8 && chkpassword.length > 8) {
			if (password === chkpassword) {
				try {
					const hashedPass = await bcrypt.hash(password, 10);
					user.password = hashedPass;
					await user.save();

					res.redirect("/user/shop");
				} catch (error) {
					console.error("Error updating password:", error);
					await res.redirect("/");
				}
			} else {
				errors.push("password mismatch");
				await res.render("user/user/createPass", { errors, email });
			}
		} else {
			errors.push("fill in details properly");
			await res.render("user/user/createPass", { errors, email });
		}
	},
	// conteoller for rated products view
	rateProduct: async (req, res) => {
		try {
			const { rating, review, productid, orderId } = req.query;
			console.log(rating);
			console.log(productid);
			console.log(review);
			let productExists = false;

			const existingProduct = await productModel.findOne({
				_id: productid
			});
			let ratingExist = existingProduct.rating.find((item) => item.userId.toString() == req.session.userId);

			if (ratingExist) {
				console.log("Review already exists for this product. Not adding it again.");

				productExists = true;
				const orders = await orderModel.find({ userId: req.session.userId });

				for (const order of orders) {
					const orderFound = order.items.find((item) => item._id.toString() === orderId);
					if (orderFound) {
						orderFound.ratedBefore = true;
						await order.save();
						console.log("Order found and updated:", orderFound);
					}
				}

				return res.status(400).json({ error: "Review already exists for this product" });
			}

			const product = await productModel.findOne({ _id: productid });
			product.rated = "true";
			product.rating.push({
				review: review,
				rating: rating,
				userId: req.session.userId
			});
			await product.save();
			const orders = await orderModel.find({ userId: req.session.userId });

			orders.forEach(async (order) => {
				const orderFound = order.items.find((item) => item._id.toString() === orderId);
				if (orderFound) {
					orderFound.review = review;
					orderFound.rating = rating;
					orderFound.rated = true;

					await order.save();
					console.log("Order found and updated:", orderFound);
				} else {
					console.log("Order not found");
				}
			});

			console.log(product);
		} catch (error) {
			console.log(error);
		}
	},
	// controller for useraccount view
	userAccount: async (req, res) => {
		try {
			const userId = req.session.userId;
			const users = await userModel.findById(userId);
			const product = await productModel.find({});
			let rated = [];
			const orders = await orderModel.find({ userId }).sort({ orderDate: -1 }).populate({
				path: "items.productId",
				model: "products",
				select: "images productName size productDiscount"
			});

			await checkReturnExpiry(orders);
			const refferal = await userModel.findOne({ _id: userId }, { refferalCode: 1 });
			console.log(refferal);
			const code = refferal.refferalCode;
			console.log(code);
			let delivered = [];

			for (let i = 0; i < orders.length; i++) {
				for (let j = 0; j < orders[i].items.length; j++) {
					if (orders[i].items[j].status === "Delivered") {
						delivered.push(orders[i].items[j]);
					}
				}
			}

			console.log("this is delivered:");
			console.log(delivered);

			res.render("user/user/account", { users, orders, code, delivered }) || "";
		} catch (error) {
			console.error("Error fetching user account details:", error);
		}
	},
	// controller for updating user credentials
	updateAccount: async (req, res) => {
		try {
			const userId = req.session.userId;
			const user = await userModel.findOne({ _id: userId });

			if (!user) {
				return res.status(404).send("User not found");
			}

			const currentPassword = user.password;
			console.log("current password: ", currentPassword);
			const { password, newpassword, confirmpassword, firstname, lastname } = req.body;

			const passwordMatch = await bcrypt.compare(password, currentPassword);
			console.log("Password Match:", passwordMatch);

			if (!passwordMatch || newpassword == "") {
				return res.status(401).json({ error: "Unauthorized access: Passwords do not match" });
			}

			console.log(newpassword);
			console.log(confirmpassword);
			const hashedPassword = await bcrypt.hash(newpassword, 10);
			console.log(hashedPassword);

			if (passwordMatch && hashedPassword !== "") {
				await userModel.updateOne({ _id: userId }, { $set: { password: hashedPassword, firstname: firstname, lastname: lastname } });

				res.redirect("/user/account");
			} else {
				return res.status(401).json({ error: "Unauthorized access: Passwords do not match" });
			}
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal Server Error");
		}
	},
	// controller for adding address
	addAddress: async (req, res) => {
		try {
			const userId = req.session.userId;
			const { name, phonenumber, pincode, address, city, state, landmark, addresstype, addressmode } = req.body;
			await userModel.updateOne(
				{ _id: userId },
				{
					$push: {
						address: [
							{
								name: name,
								phone: phonenumber,
								pincode: pincode,
								Address: address,
								city: city,
								state: state,
								landmark: landmark,
								Addresstype: addresstype,
								addressmode: addressmode
							}
						]
					}
				}
			);
			res.redirect("/user/account");
		} catch (error) {
			console.log(error);
		}
	},
	// controller for deleting address
	deleteAddress: async (req, res) => {
		try {
			const user = req.session.userId;
			const addressId = req.query._id;

			await userModel.updateOne({ _id: user }, { $pull: { address: { _id: addressId } } });

			res.redirect("/user/account");
		} catch (error) {
			console.log(error);
		}
	},
	// controller for editing address
	editAddress: async (req, res) => {
		try {
			const addressId = req.query._id;
			req.session.address = addressId;

			const users = await userModel.findOne({ "address._id": addressId }, { "address.$": 1 });
			// const user = users.address[0].name

			res.render("user/user/editAddress", { users });
		} catch (error) {
			console.log(error);
			res.redirect("/user/error");
		}
	},
	// controller for updating address
	updateAddress: async (req, res) => {
		try {
			const addressId = req.session.address;
			const { name, phonenumber, pincode, address, city, state, landmark, addresstype } = req.body;

			const result = await userModel.updateOne(
				{ "address._id": addressId },
				{
					$set: {
						"address.$.name": name,
						"address.$.phone": phonenumber,
						"address.$.pincode": pincode,
						"address.$.Address": address,
						"address.$.city": city,
						"address.$.state": state,
						"address.$.landmark": landmark,
						"address.$.Addresstype": addresstype
					}
				}
			);

			if (result) {
				res.redirect("/user/account");
			} else {
				res.redirect("/user/error");
			}
		} catch (error) {
			console.log(error);
			res.status(500);
		}
	},
	// controller for viewing order details
	viewOrderDetails: async (req, res) => {
		try {
			const orderId = req.query.orderId;

			const orders = await orderModel.find({ orderId }).populate({
				path: "items.productId",
				model: "products",
				select: "images productName size productDiscount"
			});

			await res.render("user/user/order-details", { orders });
		} catch (error) {
			console.log(error);
		}
	},
	// controller for cancelling order
	cancelOrder: async (req, res) => {
		try {
			const _id = req.body._id;
			console.log(_id);
			const reason = req.body.reason;
			console.log(reason);

			const orderItem = await orderModel.findOne({ "items._id": _id });

			const canceledItem = orderItem.items.find((item) => item._id.toString() === _id);

			const updatedOrder = await orderModel.updateOne(
				{ "items._id": _id },
				{
					$set: {
						"items.$.status": "Requested for cancellation",
						orderStatus: "Modified",
						"items.$.reason": reason
					}
				},
				{ arrayFilters: [{ "elem._id": _id }] }
			);

			res.status(200).json({ message: "Order item cancelled successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	// controller for returning order
	returnOrder: async (req, res) => {
		try {
			const _id = req.body._id;
			console.log(_id);
			const reason = req.body.reason;
			console.log(reason);

			const orderItem = await orderModel.findOne({ "items._id": _id });
			const canceledItem = orderItem.items.find((item) => item._id.toString() === _id);
			const refundPrice = canceledItem.price;
			const proId = canceledItem.productId;
			console.log(proId);
			const prosize = canceledItem.size;
			const proquantity = canceledItem.quantity;

			const updatedOrder = await orderModel.updateOne(
				{ "items._id": _id },
				{
					$set: {
						"items.$.status": "Requested for return",
						orderStatus: "Modified",
						"items.$.reason": reason
					},
					$inc: {
						refundAmount: refundPrice
					}
				},
				{ arrayFilters: [{ "elem._id": _id }] }
			);

			const productFound = await productModel.findOne({ _id: proId });

			if (productFound) {
				const sizeToUpdate = productFound.size.find((sizeObj) => sizeObj.size === prosize);
				if (sizeToUpdate) {
					sizeToUpdate.stock += proquantity;
					await productFound.save();

					console.log(`Stock updated for product ${proId}, size ${prosize}`);
				} else {
					console.log(`Size ${prosize} not found for product ${proId}`);
				}
			} else {
				console.log(`Product with ID ${proId} not found`);
			}

			res.status(200).json({ message: "Order item cancelled successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	// controller for userwallet
	userWallet: async (req, res) => {
		try {
			const id = req.session.userId;
			const user = await orderModel.find({ userId: id }, { refundAmount: 1 });
			let total = 0;
			for (const totalAmount of user) {
				total += totalAmount.refundAmount;
			}
			console.log(total);
			const userWallet = await userModel.updateOne({ _id: id }, { $set: { wallet: total } }, { upsert: true });
		} catch (error) {
			console.error("Error calculating total refund amount:", error);
		}
	},
	// controller for refferal claim
	refferalClaim: async (req, res) => {
		try {
			const { refferal } = req.query;
			const userId = req.session.userId;
			console.log(refferal);

			const refferCheck = await userModel.findOne({ _id: userId });
			if (!refferCheck || refferCheck.refferalCode == refferal) {
				console.log("Referral code is the user's code or user not found");
				return res.status(405).json({ error: "Invalid referral code or user not found" });
			}

			const updateResult = await refferalModel.updateOne({ refferalCode: refferal }, { $push: { reffereeId: userId } });
			const refferals = await refferalModel.findOne({ refferalCode: refferal });
			for (const refferals of "refferals.reffereeId") {
				if (userId == refferals) {
					console.log("userExists");
					return res.status(400).json({ error: "Invalid referral code or user not found" });
				}
			}
			const amount = refferals.referralOffer;
			await userModel.updateOne(
				{ _id: userId },
				{
					$set: { reffered: true },
					$inc: { wallet: amount }
				},
				{ upsert: true }
			);

			const reffererId = refferals.reffererId;
			console.log(reffererId);
			const reffererUpdate = await userModel.updateOne({ _id: reffererId }, { $inc: { wallet: amount } }, { new: true, upsert: true });
			console.log(reffererUpdate);

			if (updateResult.nModified === 0) {
				console.log("Referral code not found");
				return res.status(404).json({ error: "Referral code not found" });
			}

			res.status(200).json({ message: "Referral claimed successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Server error" });
		}
	},
	// controller for error
	error: async (req, res) => {
		try {
			if (req.session.errorOccured) {
				const error = req.session.error;
				res.render("user/user/error", { error });
				delete req.session.errorOccured;
			} else {
				res.redirect("/");
			}
		} catch (error) {
			console.log(error);
			res.render("user/user/error", { error });
		}
	},
	// controller for privacy policy
	privacypolicy: async (req, res) => {
		try {
			res.render("user/user/policy");
		} catch (error) {
			console.log(error);
		}
	},
	//     controller for page terms
	pageterms: async (req, res) => {
		try {
			res.render("user/user/page-terms");
		} catch (error) {
			console.log(error);
		}
	},
	//     controller for delivery details
	deliverydetails: async (req, res) => {
		try {
			res.render("user/user/deliveryinformation");
		} catch (error) {
			console.log(error);
		}
	},
	//     controller for contact message
	contactmessage: async (req, res) => {
		try {
			const { email, phone, name, address, message } = req.body;
			console.log(email);
			console.log(phone);
			console.log(name);
			console.log(address);
			console.log(message);
			const queries = new messageModel({
				email: email,
				phone: phone,
				name: name,
				address: address,
				query: message,
				type: "Contact"
			});
			console.log(queries);
			await queries.save();

			res.status(200);
		} catch (error) {
			console.log(error);
			res.status(500);
		}
	},
	//     controller for dealer message
	dealermessage: async (req, res) => {
		try {
			const { email, phone, name, address, message } = req.body;
			console.log(email);
			console.log(phone);
			console.log(name);
			console.log(address);
			console.log(message);
			const queries = new messageModel({
				email: email,
				phone: phone,
				name: name,
				address: address,
				query: message,
				type: "Dealer"
			});
			console.log(queries);
			await queries.save();

			res.status(200);
		} catch (error) {
			console.log(error);
			res.status(500);
		}
	}
};
