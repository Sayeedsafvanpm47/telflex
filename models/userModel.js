const mongoose = require('mongoose')

const { USER } = require('../utils/constants/schemaName')

let userSchema = new mongoose.Schema({
          email:{
                    type : String,
                    required : true,
                    unique : true
          },
          password:{
                    type : String,
                    required : true,
                    
          },
          firstname : {
                    type : String,
                    required : true
          },
          phonenumber : {
                    type : Number,
                    required : true
          },
          otp :String,
          otpExpires : Date,
          otpAttempts:Number
})

module.exports = mongoose.model(USER,userSchema)