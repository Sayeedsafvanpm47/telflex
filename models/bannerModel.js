const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
         bannerType : String,
         bannerTitle : Array,
         bannerPhrase : Array,
         bannerSubText : Array,
         bannerAction : Array,
         bannerDiscount : Array,
         bannerOffer : Array,
         bannerMrp : Array,
     
         end : Date,
         images : Array

})

module.exports = mongoose.model('Banner',bannerSchema)