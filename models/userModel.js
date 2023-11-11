const mongoose = require("mongoose");

const { USER } = require("../utils/constants/schemaName");

let userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	isVerified : {
		type : Boolean,
		default : false
	},
	password: {
		type: String,
		required: true
	},
	firstname: {
		type: String,
		required: true
	},lastname : {
		type: String,
		required: true
	},
	phonenumber: {
		type: Number,
		required: true
	},
	otp: String,
	otpExpires: Date,
	otpAttempts: Number,
	isAdmin: {
		type: Boolean,
		default: 0
	},
	isBlocked: {
		type: Boolean,
		default: 0
	},
	address : [
		{
			name : {
				type : String,required : true
			},
			phone : {
				type : Number,required : true
			},
			pincode : {
				type :Number, required : true
			},
			Address : {
				type : String ,required : true
			},
			city : {
				type :String, required : true
			},
			state : {
				type :String, required : true
			},
			landmark : {
				type :String, required : true
			},
			Addresstype : {
				type : String, required :true

			},
			addressmode : {
				type : String
			} 
		}
	]
});

module.exports = mongoose.model(USER, userSchema);
