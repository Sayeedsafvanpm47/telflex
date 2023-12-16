const express = require("express");
const router = express.Router();



router.use(express.urlencoded({extended: true}));
// const multer = require('multer')
// const upload = multer({dest:'uploads/'})

const checkImage = require('../../middlewares/checkImageLength')

const controller = require("../../controllers/admin/adminController");
const controllerUserManage = require("../../controllers/admin/adminUserManage");
const controllerCategory = require("../../controllers/admin/categoryController");
const controllerProducts = require('../../controllers/admin/productController');
const adminOrderController = require('../../controllers/admin/adminOrderController')
const productModel = require("../../models/productModel");
const imageController = require('../../controllers/imageController')
const dashboardController = require('../../controllers/admin/adminDashboardController')
const offerController = require('../../controllers/admin/adminOfferController')
const bannerController = require('../../controllers/admin/adminBannerController')
const sessionCheck = require('../../middlewares/sessionMiddleware')
// admin
router.get("/", controller.getAdminLogin);
router.post("/postLogin",controller.postAdminLogin);
router.get("/getForgotPassword",controller.getForgotPassAdmin);
router.post("/forgotPassword", controller.postForgotPassAdmin);
router.post("/verifyOtp", controller.verifyOtp);
router.post("/updatePass", controller.updatePass);
router.post("/resendOtp", controller.resendOtp);
router.get('/home',sessionCheck.checkAdminSignIn,controller.adminHome)
router.get('/chart',sessionCheck.checkAdminSignIn,controller.chart)
router.get('/reviews',sessionCheck.checkAdminSignIn,controller.reviews)
router.get('/logout',controller.logout)
router.get('/sellers',(req,res)=>{
  res.render('admin/admin/sellerslist')
})

// customer management
router.get("/viewCustomers", sessionCheck.checkAdminSignIn,controllerUserManage.viewCustomers);
// router.get("/editCustomers", controllerUserManage.editCustomers);
router.post("/updateUser", sessionCheck.checkAdminSignIn,controllerUserManage.updateUser);
router.get("/blockUser", sessionCheck.checkAdminSignIn,controllerUserManage.blockUser);
router.post("/searchUser", sessionCheck.checkAdminSignIn,controllerUserManage.searchUser);
router.get("/searchView",sessionCheck.checkAdminSignIn, controllerUserManage.searchView);
router.post("/sortUser",sessionCheck.checkAdminSignIn, controllerUserManage.sortUser);
router.get("/sortUserView",sessionCheck.checkAdminSignIn, controllerUserManage.sortUserView);
router.get('/salesReport',sessionCheck.checkAdminSignIn,dashboardController.salesReport)
router.post('/getReport',sessionCheck.checkAdminSignIn,dashboardController.getReport)
router.get('/getReportResults',sessionCheck.checkAdminSignIn,dashboardController.getReportResults)
// product and category management
router.get("/createCategory", sessionCheck.checkAdminSignIn,controllerCategory.createCategory);
router.post("/submitCategory", sessionCheck.checkAdminSignIn,controllerCategory.submitCategory);
router.get('/viewEditCategory',sessionCheck.checkAdminSignIn,controllerCategory.viewEditCategory)
router.post('/editCategory',sessionCheck.checkAdminSignIn,controllerCategory.editCategory)
router.get('/deleteCategory',sessionCheck.checkAdminSignIn,controllerCategory.deleteCategory)
router.get('/toggleList',sessionCheck.checkAdminSignIn,controllerCategory.listToggle)

router.get('/addproducts',sessionCheck.checkAdminSignIn,controllerProducts.addProductsView)
// router.post('/saveproducts',imageController.upload.array('images'),imageController.processImage,controllerProducts.addProducts)
router.post(
          '/saveproducts',sessionCheck.checkAdminSignIn,
          imageController.upload.array('images'),
          (req, res, next) => {
        
            imageController.processImage(req, res, next, 720, 720);
          },
          controllerProducts.addProducts
        );
router.get('/viewproducts',sessionCheck.checkAdminSignIn,controllerProducts.viewProducts)
router.get('/searchProductsView',sessionCheck.checkAdminSignIn,controllerProducts.searchProductsView)
router.post('/searchProducts',sessionCheck.checkAdminSignIn,controllerProducts.searchProducts)
router.get('/editProductsView',sessionCheck.checkAdminSignIn,controllerProducts.editProductsView)
router.get('/deleteImage',sessionCheck.checkAdminSignIn,controllerProducts.deleteImage)
router.post('/editProducts',sessionCheck.checkAdminSignIn,imageController.upload.array('images'), (req, res, next) => {
       
          imageController.processImage(req, res, next, 720, 720);
        },controllerProducts.editProducts)
router.get('/toggleListProducts',sessionCheck.checkAdminSignIn,controllerProducts.toggleList)
router.get('/deleteProducts',sessionCheck.checkAdminSignIn,controllerProducts.deleteProducts)

router.get('/orderDetails',sessionCheck.checkAdminSignIn,adminOrderController.orderDetails)
router.get('/viewOrderDetails',sessionCheck.checkAdminSignIn,adminOrderController.viewOrderDetails)
router.post('/updateOrderStatus',sessionCheck.checkAdminSignIn,adminOrderController.updateOrderStatus)
router.post('/orderSearchResults',sessionCheck.checkAdminSignIn,adminOrderController.orderSearchResults)


// offers
router.get('/getProductOffers',sessionCheck.checkAdminSignIn,offerController.getproductOffer)
router.post('/productOffer',sessionCheck.checkAdminSignIn,offerController.productOffer)
router.get('/getCategoryOffer',sessionCheck.checkAdminSignIn,offerController.getCategoryOffer)
router.post('/offerCategory',sessionCheck.checkAdminSignIn,offerController.offerCategory)
router.get('/getcouponOffer',sessionCheck.checkAdminSignIn,offerController.getCouponOffer)
router.post('/saveCoupon',sessionCheck.checkAdminSignIn,offerController.saveCoupon)
router.post('/updateCoupon',sessionCheck.checkAdminSignIn,offerController.updateCoupon)
router.get('/couponStatus',sessionCheck.checkAdminSignIn,offerController.couponStatus)
router.get('/showRefferals',sessionCheck.checkAdminSignIn,offerController.showRefferals)

// deals banner
router.post('/dealsBanner',sessionCheck.checkAdminSignIn,imageController.upload.array('images1'),checkImage.checkDealsBanner, (req, res, next) => {
          
          imageController.processImage(req, res, next, 636, 439);
        },bannerController.dealsBanner)
// festival banner
        router.post('/festivalBanner',sessionCheck.checkAdminSignIn,imageController.upload.array('images5'),checkImage.checkDealsBanner, (req, res, next) => {
          
          imageController.processImage(req, res, next, 636, 439);
        },bannerController.festivalBanner)
// main banner
        router.post('/mainBanner',sessionCheck.checkAdminSignIn,imageController.upload.array('images2'),checkImage.checkMainBanner,(req, res, next) => {
          
          imageController.processImage(req, res, next, 731, 470);
        },bannerController.mainBanner),
// about banner

        router.post('/aboutBanner',sessionCheck.checkAdminSignIn,imageController.upload.array('images6'),checkImage.checkMainBanner,(req, res, next) => {
          
          imageController.processImage(req, res, next, 731, 470);
        },bannerController.aboutBanner),
// sub banner

        router.post('/subBanner',sessionCheck.checkAdminSignIn,imageController.upload.array('images3'),checkImage.checkSubBanner, (req, res, next) => {
          
          imageController.processImage(req, res, next, 1296, 295);
        },bannerController.subBanner)

// offer banner 
        router.post('/offerBanner',sessionCheck.checkAdminSignIn,imageController.upload.array('images4'),checkImage.checkOfferBanner, (req, res, next) => {
          
          imageController.processImage(req, res, next, 416, 177);
        },bannerController.offerBanner)
router.get('/banner',sessionCheck.checkAdminSignIn,bannerController.showBanner),
router.post('/mainAboutBanner',sessionCheck.checkAdminSignIn,imageController.upload.array('images7'),checkImage.checkMainBanner,(req, res, next) => {
          
  imageController.processImage(req, res, next, 731, 470);
},bannerController.mainAboutBanner),
router.post('/dealerBanner',sessionCheck.checkAdminSignIn,imageController.upload.array('images8'),checkImage.checkMainBanner,(req, res, next) => {
          
  imageController.processImage(req, res, next, 731, 470);
},bannerController.dealerBanner),
router.post('/contactBanner',sessionCheck.checkAdminSignIn,imageController.upload.array('images9'),checkImage.checkMainBanner,(req, res, next) => {
          
  imageController.processImage(req, res, next, 731, 470);
},bannerController.contactBanner),




router.get('/viewSaved',sessionCheck.checkAdminSignIn,async (req,res)=>{
          const products = await productModel.findOne({})
          res.render('admin/productsShow',{products})
})

router.get('/editProfile',sessionCheck.checkAdminSignIn,controller.editProfile)



module.exports = router;
