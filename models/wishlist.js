const mongoose = require('mongoose');
const { USER } = require('../utils/constants/schemaName');
let wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
    required: true
  },
  products: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true
   
    
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
    stock : {
          type : Number
    },
    disc : {
          type : Number
    }
   ,  proid : {
    type: mongoose.Schema.Types.ObjectId,
          
  }
  }] ,


});

module.exports = mongoose.model('Wishlist', wishlistSchema);


