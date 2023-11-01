const mongoose = require("mongoose");

let categorySchema = new mongoose.Schema({
	categoryName: {
		type: String,
		unique : true
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
	}
});
module.exports = mongoose.model("categories", categorySchema);
