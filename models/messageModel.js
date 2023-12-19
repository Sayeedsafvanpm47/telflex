const mongoose = require('mongoose')

let messageSchema = new mongoose.Schema({

        name : String,
        email : String,
        phonenumber : String,
        address: String,
        query : String,
        type : String


      
        
})
module.exports = mongoose.model('message',messageSchema)