const express = require('express')
const app = express()
const path = require('path')
const userRoute = require('./routes/user/user')

const dbConnect = require('./config/database')


// connect to database
dbConnect()

app.use(express.urlencoded({ extended: true }));


app.use('/user',userRoute)



app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))



app.listen(3000,()=>console.log('listening to port 3000'))

