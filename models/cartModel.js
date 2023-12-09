const mongoose = require('mongoose');
const { USER } = require('../utils/constants/schemaName');
let cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
    required: true
  },
  products: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
  
    },
    productName : String
    ,
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    size: {
      type: String,
     
    },
    price: {
      type: Number,
      required: true
    },
    mrp: {
      type: Number,
      required: true
    },
    stock : {
      type : Number
    },lastStock : {
      type : Number
    }
   
  }], total : {
    type : Number,
    default : 0
  },
subtotal : {
  type : Number,
  default : 0
}
  ,
  couponApplied : {
    type : String,
    default : 'null'
  } ,couponCode : {
    type : String
},

});

module.exports = mongoose.model('Cart', cartSchema);


