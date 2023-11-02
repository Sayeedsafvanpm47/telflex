const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
	productName: {
		type: String
	},
	productPrice: {
		type: Number,
		default: 0
	},
	productDiscount: {
		type: Number,
		default: 0
	},
	stock: {
		type: Number,
		default: 0
	},
	cloth: {
		type: String
	},
	model: {
		type: String
	},
	size: {
		type: String
	},
	isFeatured: {
		type: Boolean
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
	}
});

module.exports = mongoose.model("products", productSchema);
