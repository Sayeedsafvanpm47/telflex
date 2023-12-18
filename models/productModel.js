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
	},
	productselect : {
		type : String
	},
	productDiscount : {
		type :Number,
		default : 0
	},
	lastStock : {
		type : Number
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
	}
	,  category: { 
		type: mongoose.Schema.Types.ObjectId,
		ref: 'categories',
	},
		
	tags : {
		type : String
	}
	
	
	,
	model: {
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
	},
	featured : {
		type : String,
		default : 'No'
	},
	features : {
		type : String
	},
	rating : [{
		review : String,
		rating : Number,
		userId :{ type: mongoose.Schema.Types.ObjectId,
		ref: 'USER'
		},
		hidden:{
			type:Boolean,
			default : false
		},
		reviewedOn :{type:Date,default : Date.now()}
		
	}],
	rated : {
		type : Boolean,
		default : false
	},
	
});

module.exports = mongoose.model("products", productSchema);
