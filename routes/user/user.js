const express = require("express");
const router = express.Router();

const controller = require("../../controllers/user/userController");

router.get("/", controller.getLogin);
router.post("/postLogin", controller.postLogin);
router.get("/gethome", controller.getHome);
router.get("/getsignup", controller.getSignUp);
router.post("/signup", controller.postSignUp);
router.post("/resendOtp", controller.resendOtp);
router.post("/verifyOtp", controller.verifyOTP);
router.get("/getForgotPassword", controller.getForgotPassword);
router.post("/forgotPassword", controller.forgotPassword);
router.post("/updatePass", controller.updatePass);
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
router.get('/productdetail',(req,res)=>{
          res.render('user/user/productdetails')
})
router.get('/logintemp',(req,res)=>{
          res.render('user/user/login')
})
router.get('/regtemp',(req,res)=>{
          res.render('user/user/register')
})

module.exports = router;
