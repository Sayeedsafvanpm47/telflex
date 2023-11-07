const mongoose = require("mongoose");
const Schema = mongoose.Schema


const sizeRateSchema = new Schema({
	size: {
	  type: String,
	  
	},
	productPrice: {
	  type: Number,
	 default : 0
	},
	stock : {
		type : Number,
		default : 0
	},
	mrp : {
		type : Number,
		default : 0
	}
        });


let productSchema = new mongoose.Schema({
	productName: {
		type: String
	},
	size:[sizeRateSchema]
	,
	productDiscount: {
		type: Number,
		default: 0
	},  category: { type: String},
		
	
	
	
	cloth: {
		type: String
	},
	model: {
		type: String
	},
	
	isFeatured: {
		type: String
	},

	images:{
		type : Array
	},
	description: {
		type: String
	},
	shortDescription : {
		type : String
	}
	,
	createdOn: {
		type: Date
	},
	updatedOn: {
		type: Date
	},
	mrp : {
		type : Number
	},
	isListed : {
		type : Boolean,
		default : true
	}
});

module.exports = mongoose.model("products", productSchema);
