const session = require('express-session')
require('dotenv').config()
const sessionMiddleware = session({
          secret : process.env.SECRET_KEY,
          resave : false,
          saveUninitialized : false,
          cookie : {
                    secure : false,
                    maxAge : 24*60*60*1000
          }

})

function setNoCache(req,res,next){
          res.setHeader('Cache-Control','no-store, no-cache,must-revalidate,private')
          next()
}

module.exports = {sessionMiddleware,setNoCache}