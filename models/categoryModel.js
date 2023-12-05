const mongoose = require("mongoose");

let categorySchema = new mongoose.Schema({
	categoryName: {
		type: String,
		
	},
	description: {
		type: String
	},
	createdOn: {
		type: Date
	},
	updatedOn: {
		type: Date
	},
	published : {
		type : Boolean,
		default : true
	},
	discount :{
		type : Number
	},
	offerDate : {
		type : Date,
		default : Date.now()
	}
});
module.exports = mongoose.model("categories", categorySchema);
