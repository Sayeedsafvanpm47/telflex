const mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "USER",
		required: true
	},
	items: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId
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
				type: String,
				required: true
			},
			status: {
				type: Boolean,
				default: false
			}
		}
	],
	orderId: { type: mongoose.Schema.Types.ObjectId },
	paymentMethod: {
		type: String
	},
	orderPlaced: {
		type: Boolean,
		default: false
	},
	orderShipped: {
		type: Boolean,
		default: false
	},
	orderDelivered: {
		type: Boolean,
		default: false
	},
	orderCanceled: {
		type: Boolean,
		default: true
	},
	orderReturned: {
		type: Boolean,
		default: false
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
		enum: ["Pending", "Paid", "Failed"],
		default: "Pending"
	},
	totalAmount: {
		type: Number,
		required: true
	},
          products : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : 'products'
          }
});

module.exports = mongoose.model("Order", orderSchema);
