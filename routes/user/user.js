const express = require("express");
const router = express.Router();

const controller = require("../../controllers/user/userController");
const productController = require('../../controllers/user/userProductController')
const cartController = require('../../controllers/user/userCartController')
const userCheckoutController = require('../../controllers/user/userCheckoutController')
const wishListController = require('../../controllers/user/userWishlistController');
const wishlist = require("../../models/wishlist");
const authMiddleWare = require('../../middlewares/sessionMiddleware')
// const { handleValidationError } = require('../../middlewares/errorMiddleware');

router.use((req, res, next) => {
          res.locals.loggedIn = req.session.userId ? true : false; 
          res.locals.wishCount = req.session.wishcount 
          res.locals.cartCount = req.session.cartcount
          next();
        });
      

router.get("/shop", controller.getLogin);
router.post("/postLogin",controller.postLogin);

router.get('/error',controller.error)
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
router.get('/account',authMiddleWare.checkSignIn,controller.userAccount)
router.post('/updateAccount',authMiddleWare.checkSignIn,controller.updateAccount)
router.post('/addAddress',authMiddleWare.checkSignIn,controller.addAddress)
router.get('/deleteAddress',authMiddleWare.checkSignIn,controller.deleteAddress)
router.get('/editAddress',authMiddleWare.checkSignIn,controller.editAddress)
router.post('/updateAddress',authMiddleWare.checkSignIn,controller.updateAddress)
router.get('/viewOrderDetails',authMiddleWare.checkSignIn,controller.viewOrderDetails)
router.post('/updateCart',authMiddleWare.checkSignIn,cartController.updateCart)
router.post('/cancelOrder',authMiddleWare.checkSignIn,controller.cancelOrder)
router.get('/returnOrder',authMiddleWare.checkSignIn,controller.returnOrder)
router.get('/cancelledOrders',authMiddleWare.checkSignIn,controller.cancelledOrders)
router.get('/userWallet',authMiddleWare.checkSignIn,controller.userWallet)
router.get('/refferalClaim',authMiddleWare.checkSignIn,controller.refferalClaim)
router.get('/home',authMiddleWare.checkSignIn,controller.homepage)


router.get('/',authMiddleWare.checkBlock,productController.productGridView)
router.get('/sortCategory',productController.sortProducts)
router.post('/sortPrice',productController.sortPrice)
router.post('/searchProducts',productController.searchProducts)
router.get('/productdetail',productController.productdetail)
router.get('/showPrice',productController.showPrice)


router.post('/addToCart',authMiddleWare.checkSignIn,cartController.addToCart)
router.get('/showCart',authMiddleWare.checkSignIn,authMiddleWare.checkSignIn,cartController.showCart)
router.get('/deleteCart',authMiddleWare.checkSignIn,cartController.deleteCart)
router.post('/checkOut',authMiddleWare.checkSignIn,cartController.checkOut)
router.get('/applyCoupon',authMiddleWare.checkSignIn,cartController.applyCoupon)

router.get('/checkoutPage',authMiddleWare.checkSignIn,userCheckoutController.checkOutPage)
router.post('/checkOutAddress',authMiddleWare.checkSignIn,userCheckoutController.addAddress)
router.post('/placeOrder',authMiddleWare.checkSignIn,userCheckoutController.placeOrder)


router.get('/showwishlist',authMiddleWare.checkSignIn,wishListController.showWishList)
router.post('/addToWish',authMiddleWare.checkSignIn,wishListController.addToWish)
router.get('/deleteWish',authMiddleWare.checkSignIn,wishListController.deleteWish)
router.get('/addfromwish',authMiddleWare.checkSignIn,wishListController.addFromWish)



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
router.get('/wishlist',(req,res)=>{
  res.render('user/user/shop-wishlist')
})


router.get('/regtemp',(req,res)=>{
          res.render('user/user/register')
})

router.get('/razorpay',(req,res)=>{
  res.render('user/user/razorpay')
})


module.exports = router;
