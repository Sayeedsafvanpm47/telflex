const userModel = require("../../models/userModel");
const orderModel = require('../../models/orderModel')
const categoryModel = require('../../models/categoryModel')
const sendOTPByEmail = require("../../utils/sendMail");
const bcrypt = require("bcrypt");
const otpGenerator = require("../../utils/otpGenerator");
const sendOtp = require("../../utils/generateAndSendOtp");
const { isEmailValid, isPasswordValid } = require("../../utils/validators/signUpValidator");
module.exports = {
	getAdminLogin: async (req, res) => {
		try {
			await res.render("admin/admin/login");
			
		} catch (error) {
			res.status(404).send('error occured')
		}
		
	},
	chart : async (req,res)=>{
		try {
			const userData = await userModel.find({});
			const orderData = await orderModel.countDocuments();
			const categories = await categoryModel.countDocuments();
			const totalRevenue = await orderModel.aggregate([
			  {
			    $group: {
			      _id: null,
			      totalAmount: { $sum: '$totalAmount' }
			    }
			  }
			]);
			const totalProductsSold = await orderModel.aggregate([
				{
				    $match: {
				        orderDate: { $gte: new Date('2023-01-01'), $lte: new Date('2023-12-31') }
				    }
				},
				{
				    $unwind: '$items'
				},
				{
				    $group: {
				        _id: { $month: '$orderDate' },
				        totalProducts: { $sum: '$items.quantity' } 
				    }
				}
			      ]);
			      
			
			const monthlyEarnings = await orderModel.aggregate([
			  {
			    $match: {
			      orderDate: { $gte: new Date('2023-01-01'), $lte: new Date('2023-12-31') }
			    }
			  },
			  {
			    $group: {
			      _id: { $month: '$orderDate' },
			      totalEarnings: { $sum: '$totalAmount' }
			    }
			  }
			]);
			const monthlyOrdersCount = await orderModel.aggregate([
				{
				    $match: {
				        orderDate: { $gte: new Date('2023-01-01'), $lte: new Date('2023-12-31') }
				    }
				},
				{
				    $group: {
				        _id: { $month: '$orderDate' },
				        totalOrders: { $addToSet: '$orderId' }
				    }
				},
				{
				    $project: {
				        _id: 1,
				        orderCount: { $size: '$totalOrders' }
				    }
				}
			      ]);
	console.log(monthlyOrdersCount)

		      
			console.log(totalRevenue);
			console.log(totalProductsSold);
			console.log(monthlyEarnings);
		      
			const monthlyRevenue = Array.from({ length: 12 }, () => 0);
        const monthlyProductsSold = Array.from({ length: 12 }, () => 0);
        const monthlyOrders = Array.from({ length: 12 }, () => 0);
const categoryOrders = []
        monthlyEarnings.forEach((item) => {
            monthlyRevenue[item._id - 1] = item.totalEarnings;
        });

        totalProductsSold.forEach((item) => {
            monthlyProductsSold[item._id - 1] = item.totalProducts;
        });

        monthlyOrdersCount.forEach((item) => {
            monthlyOrders[item._id - 1] = item.orderCount;
        });
    
        const categorySales = await orderModel.aggregate([
	{
	  $unwind: "$items" 
	},
	{
	  $lookup: {
	    from: "products",
	    localField: "items.productId",
	    foreignField: "_id",
	    as: "productDetails"
	  }
	},
	{
	  $unwind: "$productDetails"
	},
	{
	  $lookup: {
	    from: "categories",
	    localField: "productDetails.category",
	    foreignField: "_id",
	    as: "categoryDetails"
	  }
	},
	{
	  $unwind: "$categoryDetails"
	},
	{
	  $group: {
	    _id: "$categoryDetails.categoryName",
	    totalProductsSold: { $sum: "$items.quantity" }
	  }
	},
	{
	  $project: {
	    categoryName: "$_id",
	    totalProductsSold: 1,
	    _id: 0
	  }
	}
        ]);
        console.log(categorySales)
      
        

        const chartData = {
            monthlyRevenue,
            monthlyProductsSold,
            monthlyOrders,
	  categorySales
        };
        res.json({ chartData });
		        } catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal server error' }); // Handle error response
		        }
	},
	adminHome: async (req, res) => {
		try {
		  const userData = await userModel.find({});
		  const orderData = await orderModel.countDocuments();
		  const orders = await orderModel.find({}).sort({orderDate : -1})
		  const categories = await categoryModel.countDocuments();
		  const totalRevenue = await orderModel.aggregate([
		    {
		      $group: {
		        _id: null,
		        totalAmount: { $sum: '$totalAmount' }
		      }
		    }
		  ]);
		  const totalProductsSold = await orderModel.aggregate([
		    { $unwind: '$items' },
		    {
		      $group: {
		        _id: null,
		        totalProducts: { $sum: 1 }
		      }
		    }
		  ]);
		  const monthlyEarnings = await orderModel.aggregate([
		    {
		      $match: {
		        orderDate: { $gte: new Date('2023-01-01'), $lte: new Date('2023-12-31') }
		      }
		    },
		    {
		      $group: {
		        _id: { $month: '$orderDate' },
		        totalEarnings: { $sum: '$totalAmount' }
		      }
		    }
		  ]);
	        
		
	        
		  res.render('admin/admin/home', {
		    totalRevenue,
		    totalProductsSold,
		    monthlyEarnings,
		    orderData,
		    categories,
		    orders
		 
		  });
		} catch (error) {
		  console.log(error);
		}
	        },
	        
	
	postAdminLogin: async (req, res) => {
		const { email, password } = req.body;
		const errors = [];
                     if(!email || !password){
			errors.push('fill the fields properly')
		 }
		// Validation checks
		if (!email) {
			errors.push("Enter an email");
		}

		if (!password) {
			errors.push("Enter a password");
		}

		if (errors.length > 0) {
			return res.render("admin/admin/login", { errors });
		}

		try {
			const user = await userModel.findOne({ email });
			if (user) {
				const passCheck = await bcrypt.compare(password, user.password);
				if (user.isAdmin === true && passCheck) {
					console.log(user.isAdmin);
					res.redirect('/admin/home')
				} else {
					errors.push("Invalid credentials");
					res.render("admin/admin/login", { errors });
				}
			} else {
				errors.push("User not found");
				res.render("admin/admin/login", { errors });
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

			await res.render("admin/admin/createPass", { email: email });
		} else {
			user.otpAttempts += 1;
			await user.save();
			res.send("Invalid OTP");
		}
	},
	resendOtp: async (req, res) => {
		const { email } = req.body;
		await sendOtp(email);
		res.render("admin/admin/otpVerify", { email: email });
	},
	getForgotPassAdmin: async (req, res) => {
		await res.render("admin/admin/forgotPassword");
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
				res.render("admin/admin/otpVerify", { email: email });
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
				res.redirect("/admin/createPass");
			}
		} else {
			res.redirect("/admin/createPass");
		}
	},

	
};
