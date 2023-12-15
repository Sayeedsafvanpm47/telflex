const express = require("express");
const router = express.Router();

const shop = require('../controllers/user/userProductController')

router.use((req, res, next) => {
          res.locals.loggedIn = req.session.userId ? true : false; 
          res.locals.wishCount = req.session.wishcount 
          res.locals.cartCount = req.session.cartcount
          next();
        });

router.get('/',shop.productGridView)

module.exports = router
