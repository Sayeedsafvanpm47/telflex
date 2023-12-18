const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid')
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
				type : String,

			},
			addressmode : {
				type : String
			} 
		}
	],
	refferalCode : {
		type: String,
                    default: () => {
			const uuid = uuidv4();
			
			return uuid.replace(/-/g, '').substring(0, 6);
		      }
	},
	reffered : {
		type : Boolean,
		default : false

	},
	refferalUse : {
		type : Boolean,
		default : false
	},
	wallet : {
		type : Number,
		default : 0
	}
});

module.exports = mongoose.model(USER, userSchema);
