const session = require('express-session')
require('dotenv').config()
const userModel = require('../models/userModel')

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

async function checkSignIn(req, res, next) {
          if (!req.session.user) {
            await res.redirect('/user/shop');
          }
                    
          else {
           next()
          }
        }

        async function checkBlock(req,res,next){
          try {
                    if(req.session.user){
                    const blocked = await userModel.findOne({ _id: req.session.userId });
          if (blocked.isBlocked) {
        
         
           req.session.blocked = true
          res.redirect('/user/error')
          }
          
else {
          next()

        }
}


          } catch (error) {
                    res.redirect('/user/shop')
          }
          
}
module.exports = {sessionMiddleware,setNoCache,checkSignIn,checkBlock}

