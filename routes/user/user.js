const express = require("express");
const router = express.Router();

const controller = require("../../controllers/user/userController");
const productController = require("../../controllers/user/userProductController");
const cartController = require("../../controllers/user/userCartController");
const userCheckoutController = require("../../controllers/user/userCheckoutController");
const wishListController = require("../../controllers/user/userWishlistController");
const authMiddleWare = require("../../middlewares/sessionMiddleware");


router.use((req, res, next) => {
	res.locals.loggedIn = req.session.userId ? true : false;
	res.locals.wishCount = req.session.wishcount;
	res.locals.cartCount = req.session.cartcount;
	next();
});

// userController controller file routes begins

router.get("/shop", controller.getLogin);
router.post("/postLogin", controller.postLogin);
router.get("/error", controller.error);
router.get("/getsignup", controller.getSignUp);
router.post("/signup", controller.postSignUp);
router.get("/logout", controller.logout);
router.get("/showOtp", controller.showOtp);
router.post("/resendOtp", controller.resendOtp);
router.post("/verifyOtp", controller.verifyOTP);
router.get("/getForgotPassword", controller.getForgotPassword);
router.post("/forgotPassword", controller.forgotPassword);
router.get("/showCreatePass", controller.showCreatePass);
router.post("/updatePass", controller.updatePass);
router.get("/account", authMiddleWare.checkSignIn, authMiddleWare.checkBlock, controller.userAccount);
router.post("/updateAccount", authMiddleWare.checkSignIn, controller.updateAccount);
router.post("/addAddress", authMiddleWare.checkSignIn, controller.addAddress);
router.get("/deleteAddress", authMiddleWare.checkSignIn, controller.deleteAddress);
router.get("/editAddress", authMiddleWare.checkSignIn, controller.editAddress);
router.post("/updateAddress", authMiddleWare.checkSignIn, controller.updateAddress);
router.get("/viewOrderDetails", authMiddleWare.checkSignIn, controller.viewOrderDetails);
router.post("/cancelOrder", authMiddleWare.checkSignIn, controller.cancelOrder);
router.post("/returnOrder", authMiddleWare.checkSignIn, controller.returnOrder);
router.get("/userWallet", authMiddleWare.checkSignIn, controller.userWallet);
router.get("/refferalClaim", authMiddleWare.checkSignIn, controller.refferalClaim);
router.get("/rateProduct", controller.rateProduct);
router.get("/home", controller.homepage);
router.get("/about", controller.getAbout);
router.get("/dealer", controller.getDealers);
router.get("/contact", controller.getContact);
router.get("/policy", controller.privacypolicy);
router.get("/pageterms", controller.pageterms);
router.get("/deliverydetails", controller.deliverydetails);
router.post("/contactmessage", controller.contactmessage);
router.post("/dealermessage", controller.dealermessage);

// userController controller file routes ends...

// userCartController controller file routes begins

router.post("/addToCart", authMiddleWare.checkSignIn, authMiddleWare.checkBlock, cartController.addToCart);
router.get("/showCart", authMiddleWare.checkSignIn, authMiddleWare.checkBlock, cartController.showCart);
router.get("/deleteCart", authMiddleWare.checkSignIn, cartController.deleteCart);
router.post("/checkOut", authMiddleWare.checkSignIn, cartController.checkOut);
router.get("/applyCoupon", authMiddleWare.checkSignIn, cartController.applyCoupon);
router.post("/updateCart", authMiddleWare.checkSignIn, cartController.updateCart);

// userCartController controller file routes ends...

// userproductController controller file routes begins

router.get("/", productController.productGridView);
router.get("/paginate", productController.pagination);
router.get("/sortBy", productController.sortBy);
router.get("/sortCategory", productController.sortProducts);
router.get("/sortedProducts", productController.sortedProducts);
router.post("/sortPrice", productController.sortPrice);
router.post("/searchProducts", productController.searchProducts);
router.get("/productdetail", productController.productdetail);
router.get("/showPrice", productController.showPrice);

// userproductController controller file routes ends...

// userCheckoutController controller file routes begins

router.get("/checkoutPage", authMiddleWare.checkSignIn, authMiddleWare.checkBlock, userCheckoutController.checkOutPage);
router.post("/checkOutAddress", authMiddleWare.checkSignIn, userCheckoutController.addAddress);
router.post("/placeOrder", authMiddleWare.checkSignIn, userCheckoutController.placeOrder);

// userCheckoutController controller file routes begins

// userwishListController controller file routes begins

router.get("/showwishlist", authMiddleWare.checkSignIn, authMiddleWare.checkBlock, wishListController.showWishList);
router.post("/addToWish", authMiddleWare.checkSignIn, authMiddleWare.checkBlock, wishListController.addToWish);
router.get("/deleteWish", authMiddleWare.checkSignIn, wishListController.deleteWish);
router.get("/addfromwish", authMiddleWare.checkSignIn, wishListController.addFromWish);

// userwishListController controller file routes ends...

module.exports = router;
