const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        unique: true, 
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    issuedAt: {
        type: Date,
       
    },
    expiringAt: {
        type: Date,
        
    },
    usageLimit: {
        type: Number,
        default: 1 
    },

    minimumPurchase: Number,

    redemptionHistory: [{
        userId: {
            type: ObjectId,
            ref: 'USER'
        },
        orderId: {
            type: ObjectId,
            ref: 'Order'
        },
        redeemedAt: Date
    }],
    status: {
        type: String,
    
        default: 'active' 
    },
    updatedAt: {
        type: Date,
        default:Date.now()
        
    },
    createdAt : {
          type : Date,
          default : Date.now()
    },
   
});

module.exports = mongoose.model("Coupon", couponSchema);
