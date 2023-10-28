require('dotenv').config()

const mongoose = require('mongoose')

const uri = process.env.SERVER_MONGO_URI
mongoose.set("strictQuery", false);
const dbConnect = async () =>{
try {
          await mongoose.connect(uri)
          console.log('database connected succesfully')
} catch (error) {
          console.log('error while connecting to database')
}
}
module.exports = dbConnect;