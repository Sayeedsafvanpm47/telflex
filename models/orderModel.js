const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid')
let orderSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "USER",
		required: true
	},
	items: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref : "products"
			},
			productName : {
				type:String
			},
			quantity: {
				type: Number,
				required: true,
				default: 1
			},
			size: {
				type: String,
				required: true
			},
			price: {
				type: Number,
				required: true
			},
			mrp: {
				type: Number,
				required: true
			},
			status: {
				type: String,
				default: 'Active'
			},
			reason : {
				type:String,
				default:null
			},
			returnExpiry : Date
		}
	],
	orderId: { 
		type: String,
        default: () => uuidv4()
	},
	orderStatus : {

		type: String,
		
		default: "Placed"

	},
	
	orderDate: {
		type: Date
	},
	returnDate: {
		type: Date
	},
	expectedDelivery: {
		type: Date
	},
	paymentStatus: {
		type: String,
		
		default: "Pending"
	},
	totalAmount: {
		type: Number,
		required: true
	},
	paymentMethod : {
		type : String
	},
	address : {
		type : Object
	},
	refundAmount : {
		type : Number,
		default:0
	},
	modifiedAt : {
		type : Date
	},
	couponApplied : {
		type : Boolean,
		
		

	},
	couponName : {
		type : String,
	
	},
	
         
});

module.exports = mongoose.model("Order", orderSchema);
