const userModel = require("../../models/userModel");
const orderModel = require('../../models/orderModel')
const productModel = require('../../models/productModel')
const refferalModel = require('../../models/refferalModel')
const wishlistModel = require('../../models/wishlist')
const cartModel  = require('../../models/cartModel')
const sendOTPByEmail = require("../../utils/sendMail");
const bcrypt = require("bcrypt");
const { isEmailValid, isPasswordValid, isNamesValid, isPhoneValid, isCpassValid } = require("../../utils/validators/signUpValidator");
const otpGenerator = require("../../utils/otpGenerator");
const sendOtp = require("../../utils/generateAndSendOtp");
const mongoose = require('mongoose')
const {checkReturnExpiry} = require('../../helpers/cronJob')


module.exports = {
	getLogin: async (req, res) => {
		try {
			if(!req.session.userId){
			await res.render("user/user/login");
			}else
			{
				await res.redirect('/user/')
			}
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
		  }
		  if(user.otp !== null)
		  {
			errors.push('user account has not been verified yet')
		  }
		  
		  if (user.isBlocked === true) {
		    console.log("User is Blocked");
		    errors.push("This user is blocked");
		  }

	        
		  if (errors.length > 0) {
		    res.render("user/user/login", { errors });
		  } else {
		    const passwordMatch = await bcrypt.compare(password, user.password);
		    if (passwordMatch) {

    




			req.session.userId = user._id

			

			
			console.log(req.session.userId)
		      console.log("Login successful");
		      if(req.session.cart){
		      res.redirect("/user/")
		      }
		      else
		      {
			res.redirect('/user/')
		      }
		    } else {
		      console.log("Invalid password");
		      res.redirect("/user/shop");
		    }
		  }
		} catch (err) {
		  console.error("Error in catch:", err);
		  res.redirect("/user/shop");
		}
	        },
	        
	getHome: async (req, res) => {
		if(req.session.userId)
		{
			const wishCount  = await wishlistModel.findOne({userId:req.session.userId})
			const cartCount = await cartModel.findOne({userId:req.session.userId})
			const productsincart = (cartCount.products).length
			const productsinwishlist = (wishCount.products).length
			console.log(productsinwishlist)
			req.session.wishcount = productsinwishlist
			req.session.cartcount = productsincart
		await res.render("user/index.ejs");
		}
		else
		{
			await res.render("user/index.ejs");
		}
		
	},
	homepage : async (req,res)=>{
		try {
			const products = await productModel.find({})
			
			res.render('user/user/home',{products})
		} catch (error) {
			
		}
		
	}
	,
	getSignUp: async (req, res) => {
		try {
			if(!req.session.userId){
			await res.render("user/user/register");
			}else
			{
				await res.redirect('/user/')
			}
		} catch (err) {
			console.log(err)
			res.redirect('/user/')
		}
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
			console.log(emailCheck);
			
			
			let errors = [];
			if(!email || !password || !firstname || !lastname || !phonenumber || !chkpassword)
			{
				errors.push('fill details properly')
			}

			

		if(emailCheck)
{
	if(emailCheck.isVerified){
		errors.push("email already exists")
	}

			if( emailCheck.isVerified == false){
				console.log(emailCheck)
				await userModel.findByIdAndDelete(emailCheck._id)
				
			}
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
				return res.render("user/user/register", { errors });
			}

			if (emailValid && passwordValid && namesValid && phoneValid && cpassValid) {
				
				const hashedPassword = await bcrypt.hash(password, 10);
				const user = new userModel({
					email,
					password: hashedPassword,
					firstname,
					lastname,
					phonenumber,
					

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
				req.session.isLogin = true;
				req.session.email = email
				res.redirect('/user/showOtp')
		
			
		} catch (err) {
			console.error("Error:", err);
			res.send("error");
		}
	},

	verifyOTP: async (req, res) => {
		try{
		const { email, enteredOTP } = req.body;
		const errors = []
		
		const user = await userModel.findOne({ email });
		if (!user || !user.otp || user.otpExpires <= new Date() || user.otpAttempts >= 3) {
			errors.push('verification failed, try again..., or request for another otp')

			res.render('user/user/otpVerify',{errors,email:email})
		}
		if (user.otp === enteredOTP) {
			user.otp = null;
			user.otpExpires = null;
			user.otpAttempts = 0;
			user.isVerified = true
			await user.save();
			if (req.session.loginOk) {

				const userDetails = await userModel.findOne({email:email})
				console.log(userDetails)
				const refferalCode = userDetails.refferalCode
				console.log(refferalCode)
				console.log(refferalCode)
				const _id = userDetails._id
				const refferal =  new refferalModel({
					refferalCode : refferalCode,
					reffererId : _id


				})
				await refferal.save()
				await res.redirect("/user/shop");
			}
			else if (req.session.forgotOk) {
				req.session.email = email
				req.session.createPass = true

				await res.redirect('/user/showCreatePass')
			}
		} else {
			
			user.otpAttempts += 1;
			attempts = 3 -user.otpAttempts
			await user.save();
			
			errors.push(attempts + 'attempts left')

			res.render('user/user/otpVerify',{errors,email:email})
		}
	}catch(err){
		console.log(err)
		res.redirect('/user/')
	}
	},

	showCreatePass :  async(req,res)=>{
		try {
			let errors = []
			if(req.session.createPass){

				

			const email = req.session.email
			delete req.session.createPass
			delete req.session.email
			await res.render('user/user/createPass',{email:email})

			}
			else
			{
				errors.push('Failed updating the password, please try again')
				await res.render('user/user/forgotPassword',{errors})
			}
	
			
		} catch (error) {
			
			
			await res.render('user/user/forgotPassword')
			
		}
	}

	,

	resendOtp: async (req, res) => {
		try {
			const { email } = req.body;
		await sendOtp(email);
		req.session.isForgot = true;
		req.session.email = email
		res.redirect("/user/showOtp");
		} catch (error) {
			console.log(error)
			res.redirect('/user/')
		}
		
	},
	getForgotPassword: async (req, res) => {
		try {
			if(req.session.forgotError)
			{
				let errors = []
				errors.push('corrupt credentials or fill in details properly')
				res.render('user/user/forgotPassword',{errors})
			}else{
			res.render("user/user/forgotPassword");
			}
		} catch (error) {
			res.redirect('/user')
		}
		
	}
	,
	logout : async (req,res)=>{
		try {
			delete req.session.userId
			res.redirect('/user/')
			
		} catch (error) {
			console.log(error)
			res.redirect('/user/')
		}
	}
	,
	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body;
		const emailExist =  await userModel.findOne({email:email})
		if(!emailExist){
			req.session.forgotError = true
			res.redirect('/user/getForgotPassword')
		} else{
		await sendOtp(email);
		
		req.session.isForgot = true;
		req.session.email = email
		// res.render("user/user/otpVerify", { email: email });
		res.redirect('/user/showOtp')
		}
			
		} catch (error) {
			console.log(error)
			res.redirect('/user/')
		}
		
	},
	
	showOtp: async (req,res)=>{
		try {
			const errors = []
			
			if(req.session.isForgot){

				const email = req.session.email;
				delete req.session.isForgot;
				delete req.session.email;
				req.session.forgotOk = true
			    

				res.render('user/user/otpVerify',{email :email})
			
			}
			else if(req.session.isLogin){
				const email = req.session.email
				delete req.session.isLogin
				delete req.session.email
				req.session.loginOk = true
				res.render("user/user/otpVerify", { email: email });



			}
			
			
			else
			{
				if(req.session.forgotOk){
				errors.push('otp verification failed, request again')
				res.render('user/user/forgotPassword',{errors})
				} else if(req.session.loginOk)
				{
					errors.push('otp verification failed, request again')
				res.render('user/user/register',{errors})
					
				}
			}
			
		} catch (error) {
			res.redirect('/user/getForgotPassword')
		}
	},

	updatePass: async (req, res) => {
		
		const { password, chkpassword, email } = req.body;
		const user = await userModel.findOne({ email });
                    const errors = []

		if(password.length>8 && chkpassword.length > 8){
		if (password === chkpassword) {
			try {
				const hashedPass = await bcrypt.hash(password, 10);
				user.password = hashedPass;
				await user.save();

				
				res.redirect("/user/shop");
			} catch (error) {
				console.error("Error updating password:", error);
				await res.redirect("/user/"); 
			}
		}
		else {
			errors.push('password mismatch')
			await res.render('user/user/createPass',{errors,email})
		}
	}

		 else {
			errors.push('fill in details properly')
			await res.render('user/user/createPass',{errors,email})
		}
	},
	userAccount : async (req,res)=>{
		try {
			const userId = req.session.userId;
			const users = await userModel.findById(userId);
			const product = await productModel.find({})
			const orders = await orderModel.find({ userId }).sort({orderDate:-1}).populate({
				
				path: 'items.productId',
            model: 'products',
            select: 'images productName size productDiscount',
			})

	
			await checkReturnExpiry(orders);
			const refferal = await userModel.findOne({_id:userId},{refferalCode : 1})
			console.log(refferal)
			const code = refferal.refferalCode
			console.log(code)
			
		        
      
	        
	        
			console.log(`This is orders :  ${orders}`)
			
		  
			res.render('user/user/account', { users, orders,code });
		  
			
		      } catch (error) {
			console.error('Error fetching user account details:', error);
			// Handle the error, perhaps by rendering an error page
			
		      }

	}
	,
	updateAccount : async(req,res)=>{
		try {
			const userId = req.session.userId;
const user = await userModel.findOne({ _id: userId });


if (!user) {
  return res.status(404).send('User not found');
}

const currentPassword = user.password;
console.log('current password: ', currentPassword)
const { password, newpassword, confirmpassword} = req.body;

const passwordMatch = await bcrypt.compare(password, currentPassword);
console.log('Password Match:',passwordMatch)

if (!passwordMatch) {
  console.log('Current password is incorrect');
  return res.redirect('/user/account')
}

if (newpassword !== confirmpassword) {
  console.log('New passwords do not match');
  return res.redirect('/user/account')
}
console.log(newpassword)
console.log(confirmpassword)
const hashedPassword = await bcrypt.hash(newpassword, 10);
console.log(hashedPassword)




await userModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

res.redirect('/user/account');
		        } catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
		        }
		         
		        
	},
	addAddress : async (req,res)=>{

		try {

			const userId = req.session.userId
		const {name,phonenumber,pincode,address,city,state,landmark,addresstype,addressmode} = req.body
		await userModel.updateOne({_id : userId},{$push:{address : [{name:name,phone:phonenumber,pincode:pincode,Address:address,city:city,state:state,landmark:landmark,Addresstype:addresstype,addressmode:addressmode}]}})
		res.redirect('/user/account')
			
		} catch (error) {
			console.log(error)
		}
		
		

	},
	deleteAddress : async (req,res)=>{
		const user = req.session.userId
		const addressId = req.query._id;

		await userModel.updateOne(
		  { _id: user },
		  { $pull: { 'address': { _id: addressId } } }
		);
		
	         res.redirect('/user/account')
		
		
	},
	editAddress : async (req,res)=>{
		try {
			const addressId = req.query._id
			req.session.address = addressId
			

		const users = await userModel.findOne({'address._id' : addressId},{'address.$':1})
		// const user = users.address[0].name
		
		res.render('user/user/editAddress',{users})
			
		} catch (error) {
			console.log(error)
			res.send('error occured')
		}
				
	},
	updateAddress: async (req, res) => {
		try {
		  const addressId = req.session.address;
		  const { name, phonenumber, pincode, address, city, state, landmark, addresstype } = req.body;
	        
		  // Update the specific element in the array
		  const result = await userModel.updateOne(
		    { 'address._id': addressId },
		    {
		      $set: {
		        'address.$.name': name,
		        'address.$.phone': phonenumber,
		        'address.$.pincode': pincode,
		        'address.$.Address': address,
		        'address.$.city': city,
		        'address.$.state': state,
		        'address.$.landmark': landmark,
		        'address.$.Addresstype': addresstype,
		      },
		    }
		  );
	        
		  if (result) {
			res.redirect('/user/account');
		  }
	        else{
		res.send('error')
	        }
		 
		} catch (error) {
		  console.log(error);
		  res.status(500).send('Error occurred');
		}
	        },
	        viewOrderDetails : async (req,res)=>{
		try {
			const orderId = req.query.orderId
		
			const orders = await orderModel.find({orderId}).populate({
				
				path: 'items.productId',
            model: 'products',
            select: 'images productName size productDiscount',
			})
			
		
			await res.render('user/user/order-details',{orders})

		} catch (error) {
			console.log(error)
		}
	        },
	        cancelOrder: async (req, res) => {
		try {
		    const _id = req.body._id;
		    console.log(_id);
		    const reason = req.body.reason
		    console.log(reason)
	      
	
		    const orderItem = await orderModel.findOne({ 'items._id': _id });
		 
		    const canceledItem = orderItem.items.find(item => item._id.toString() === _id);
		   
	
		 
		
	      
		
	      const updatedOrder = await orderModel.updateOne(
		{ 'items._id': _id },
		{
		  $set: {
		    'items.$.status': 'Requested for cancellation',
		    'orderStatus': 'Modified','items.$.reason' : reason
		  },
		
		},
		{ arrayFilters: [{ 'elem._id': _id }] }
	        );

		    

		
		
		    res.status(200).json({ message: 'Order item cancelled successfully' });
		} catch (error) {
		    console.error(error);
		    res.status(500).json({ error: 'Internal server error' });
		}
	      },
	      returnOrder: async (req, res) => {
		try {
			const _id = req.body._id;
			console.log(_id);
			const reason = req.body.reason
			console.log(reason)
		  
	      
	
		    const orderItem = await orderModel.findOne({ 'items._id': _id });
		    const canceledItem = orderItem.items.find(item => item._id.toString() === _id);
		 const refundPrice = canceledItem.price
	      const proId = canceledItem.productId
	      console.log(proId)
	      const prosize = canceledItem.size
	      const proquantity = canceledItem.quantity
		 
		    
		
	      const updatedOrder = await orderModel.updateOne(
		{ 'items._id': _id },
		{
		  $set: {
		    'items.$.status': 'Requested for return',
		    'orderStatus': 'Modified','items.$.reason' : reason
		  },
		  $inc: {
		    'refundAmount': refundPrice 
		  }
		},
		{ arrayFilters: [{ 'elem._id': _id }] }
	        );
		    

		   
		    const productFound = await productModel.findOne({ _id: proId });

		    if (productFound) {
		        const sizeToUpdate = productFound.size.find(sizeObj => sizeObj.size === prosize);
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
		    
		    
	      
		    res.status(200).json({ message: 'Order item cancelled successfully' });
		} catch (error) {
		    console.error(error);
		    res.status(500).json({ error: 'Internal server error' });
		}
	      }
	      ,
	      cancelledOrders : async (req,res)=>{

		
			const orders = await orderModel.find({}).populate({
				
				path: 'items.productId',
            model: 'products',
            select: 'images productName size productDiscount',
			})
			
			
			await res.render('user/user/cancelledOrders',{orders})
	      },
	      userWallet : async (req,res)=>{
		

		try {
			const id = req.session.userId
			const user = await orderModel.find({userId:id},{refundAmount:1})
			let total = 0
			for(const totalAmount of user)
			{
				total += totalAmount.refundAmount
			}
			console.log(total)
			const userWallet = await userModel.updateOne({_id:id},{$set:{wallet:total}},{upsert:true})


			
			
			
		      } catch (error) {
			console.error('Error calculating total refund amount:', error);
		      }
		      



	      },
	      refferalClaim: async (req, res) => {
		try {
		    const { refferal } = req.query;
		    const userId = req.session.userId;
		    console.log(refferal);
	      
		    const refferCheck = await userModel.findOne({ _id: userId });
		    if (!refferCheck || refferCheck.refferalCode == refferal) {
		        console.log('Referral code is the user\'s code or user not found');
		        return res.status(405).json({ error: 'Invalid referral code or user not found' });
		    }
	          
		
		      

		    const updateResult = await refferalModel.updateOne(
		        { refferalCode: refferal },
		        { $push: { reffereeId: userId } }
		    );
		    const refferals = await refferalModel.findOne({refferalCode : refferal})
		    for(const refferals of 'refferals.reffereeId')
		    {
			if(userId == refferals)
			{
				console.log('userExists')
				return res.status(400).json({ error: 'Invalid referral code or user not found' });
			}
		    }
		    const amount = refferals.referralOffer
		    await userModel.updateOne(
			{ _id: userId },
			{
			  $set: { reffered: true },
			  $inc: { wallet: amount }
			},
			{ upsert: true }
		        );
		        

		
		  const reffererId = refferals.reffererId
		  console.log(reffererId)
		       const reffererUpdate = await userModel.updateOne({ _id: reffererId }, { $inc: { wallet: amount } },{new:true, upsert: true });
		        console.log(reffererUpdate)
		 
	      
		    if (updateResult.nModified === 0) {
		        console.log('Referral code not found');
		        return res.status(404).json({ error: 'Referral code not found' });
		    }

	      
		    res.status(200).json({ message: 'Referral claimed successfully'});
		} catch (error) {
		    console.error(error);
		    res.status(500).json({ error: 'Server error' });
		}
	      
	      


	      }
	
	      
	      
	       
	        
		  
		    
	
};
