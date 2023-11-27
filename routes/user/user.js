const express = require("express");
const router = express.Router();

const controller = require("../../controllers/user/userController");
const productController = require('../../controllers/user/userProductController')
const cartController = require('../../controllers/user/userCartController')
const userCheckoutController = require('../../controllers/user/userCheckoutController')

router.use((req, res, next) => {
          res.locals.loggedIn = req.session.userId ? true : false; 
          next();
        });

router.get("/shop", controller.getLogin);
router.post("/postLogin", controller.postLogin);


router.get("/gethome", controller.getHome);
router.get("/getsignup", controller.getSignUp);
router.post("/signup", controller.postSignUp);
router.get('/logout',controller.logout)
router.get('/showOtp',controller.showOtp)
router.post("/resendOtp", controller.resendOtp);
router.post("/verifyOtp", controller.verifyOTP);
router.get("/getForgotPassword", controller.getForgotPassword);
router.post("/forgotPassword", controller.forgotPassword);
router.get('/showCreatePass',controller.showCreatePass)
router.post("/updatePass", controller.updatePass);
router.get('/account',controller.userAccount)
router.post('/updateAccount',controller.updateAccount)
router.post('/addAddress',controller.addAddress)
router.get('/deleteAddress',controller.deleteAddress)
router.get('/editAddress',controller.editAddress)
router.post('/updateAddress',controller.updateAddress)
router.get('/viewOrderDetails',controller.viewOrderDetails)
router.post('/updateCart',cartController.updateCart)
router.post('/cancelOrder',controller.cancelOrder)
router.get('/returnOrder',controller.returnOrder)
router.get('/cancelledOrders',controller.cancelledOrders)

router.get('/',productController.productGridView)
router.get('/sortCategory',productController.sortProducts)
router.post('/sortPrice',productController.sortPrice)
router.post('/searchProducts',productController.searchProducts)
router.get('/productdetail',productController.productdetail)
router.get('/showPrice',productController.showPrice)


router.post('/addToCart',cartController.addToCart)
router.get('/showCart',cartController.showCart)
router.get('/deleteCart',cartController.deleteCart)
router.post('/checkOut',cartController.checkOut)

router.get('/checkoutPage',userCheckoutController.checkOutPage)
router.post('/checkOutAddress',userCheckoutController.addAddress)
router.post('/placeOrder',userCheckoutController.placeOrder)

router.get('/blog',(req,res)=>{
          res.render('user/user/blog')
})

router.get('/index',(req,res)=>{
          res.render('user/user/index')
})
router.get('/shopCompare',(req,res)=>{
          res.render('user/user/shop-compare')
})
router.get('/shopFilter',(req,res)=>{
          res.render('user/user/shop-filter')
})

router.get('/shopgrid',(req,res)=>{
          res.render('user/user/shopgrid')
})
router.get('/shoplist',(req,res)=>{
          res.render('user/user/shoplist')
})


router.get('/regtemp',(req,res)=>{
          res.render('user/user/register')
})

router.get('/razorpay',(req,res)=>{
  res.render('user/user/razorpay')
})


module.exports = router;
