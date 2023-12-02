const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
         bannerType : String,
         bannerTitle : String,
         bannerPhrase : String,
         bannerSubText : String,
         bannerAction : String,
         bannerDiscount : Number,
         bannerOffer : Number,
         bannerMrp : Number,
         start : Date,
         end : Date,

})

module.exports = mongoose.model('Banner',bannerSchema)