const mongoose = require('mongoose');

let cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER',
    required: true
  },
  products: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true
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
    }
  }]
});

module.exports = mongoose.model('Cart', cartSchema);


