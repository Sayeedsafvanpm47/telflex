const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
let refferalSchema = new mongoose.Schema({
          reffererId : {
                    type : mongoose.Schema.Types.ObjectId
                    ,ref : 'USER'
          },
          reffereeId : [{
                    type : mongoose.Schema.Types.ObjectId,
                    ref:'USER'
          }],
          refferalCode : {
                  type : String
          },
          referralOffer : {
                    type:Number,
                    default : 100
          }

        
})
module.exports = mongoose.model('Refferal',refferalSchema)