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
// admin
router.get("/", controller.getAdminLogin);
router.post("/postLogin", controller.postAdminLogin);
router.get("/getForgotPassword", controller.getForgotPassAdmin);
router.post("/forgotPassword", controller.postForgotPassAdmin);
router.post("/verifyOtp", controller.verifyOtp);
router.post("/updatePass", controller.updatePass);
router.post("/resendOtp", controller.resendOtp);
router.get('/home',controller.adminHome)
router.get('/chart',controller.chart)
router.get('/reviews',controller.reviews)
router.get('/logout',controller.logout)
router.get('/sellers',(req,res)=>{
  res.render('admin/admin/sellerslist')
})

// customer management
router.get("/viewCustomers", controllerUserManage.viewCustomers);
// router.get("/editCustomers", controllerUserManage.editCustomers);
router.post("/updateUser", controllerUserManage.updateUser);
router.get("/blockUser", controllerUserManage.blockUser);
router.post("/searchUser", controllerUserManage.searchUser);
router.get("/searchView", controllerUserManage.searchView);
router.post("/sortUser", controllerUserManage.sortUser);
router.get("/sortUserView", controllerUserManage.sortUserView);
router.get('/salesReport',dashboardController.salesReport)
router.post('/getReport',dashboardController.getReport)
router.get('/getReportResults',dashboardController.getReportResults)
// product and category management
router.get("/createCategory", controllerCategory.createCategory);
router.post("/submitCategory", controllerCategory.submitCategory);
router.get('/viewEditCategory',controllerCategory.viewEditCategory)
router.post('/editCategory',controllerCategory.editCategory)
router.get('/deleteCategory',controllerCategory.deleteCategory)
router.get('/toggleList',controllerCategory.listToggle)

router.get('/addproducts',controllerProducts.addProductsView)
// router.post('/saveproducts',imageController.upload.array('images'),imageController.processImage,controllerProducts.addProducts)
router.post(
          '/saveproducts',
          imageController.upload.array('images'),
          (req, res, next) => {
        
            imageController.processImage(req, res, next, 720, 720);
          },
          controllerProducts.addProducts
        );
router.get('/viewproducts',controllerProducts.viewProducts)
router.get('/searchProductsView',controllerProducts.searchProductsView)
router.post('/searchProducts',controllerProducts.searchProducts)
router.get('/editProductsView',controllerProducts.editProductsView)
router.get('/deleteImage',controllerProducts.deleteImage)
router.post('/editProducts',imageController.upload.array('images'), (req, res, next) => {
       
          imageController.processImage(req, res, next, 720, 720);
        },controllerProducts.editProducts)
router.get('/toggleListProducts',controllerProducts.toggleList)
router.get('/deleteProducts',controllerProducts.deleteProducts)

router.get('/orderDetails',adminOrderController.orderDetails)
router.get('/viewOrderDetails',adminOrderController.viewOrderDetails)
router.post('/updateOrderStatus',adminOrderController.updateOrderStatus)
router.post('/orderSearchResults',adminOrderController.orderSearchResults)


// offers
router.get('/getProductOffers',offerController.getproductOffer)
router.post('/productOffer',offerController.productOffer)
router.get('/getCategoryOffer',offerController.getCategoryOffer)
router.post('/offerCategory',offerController.offerCategory)
router.get('/getcouponOffer',offerController.getCouponOffer)
router.post('/saveCoupon',offerController.saveCoupon)
router.post('/updateCoupon',offerController.updateCoupon)
router.get('/couponStatus',offerController.couponStatus)
router.get('/showRefferals',offerController.showRefferals)

// deals banner
router.post('/dealsBanner',imageController.upload.array('images1'),checkImage.checkDealsBanner, (req, res, next) => {
          
          imageController.processImage(req, res, next, 636, 439);
        },bannerController.dealsBanner)
// festival banner
        router.post('/festivalBanner',imageController.upload.array('images5'),checkImage.checkDealsBanner, (req, res, next) => {
          
          imageController.processImage(req, res, next, 636, 439);
        },bannerController.festivalBanner)
// main banner
        router.post('/mainBanner',imageController.upload.array('images2'),checkImage.checkMainBanner,(req, res, next) => {
          
          imageController.processImage(req, res, next, 731, 470);
        },bannerController.mainBanner),
// about banner

        router.post('/aboutBanner',imageController.upload.array('images6'),checkImage.checkMainBanner,(req, res, next) => {
          
          imageController.processImage(req, res, next, 731, 470);
        },bannerController.aboutBanner),
// sub banner

        router.post('/subBanner',imageController.upload.array('images3'),checkImage.checkSubBanner, (req, res, next) => {
          
          imageController.processImage(req, res, next, 1296, 295);
        },bannerController.subBanner)

// offer banner 
        router.post('/offerBanner',imageController.upload.array('images4'),checkImage.checkOfferBanner, (req, res, next) => {
          
          imageController.processImage(req, res, next, 416, 177);
        },bannerController.offerBanner)
router.get('/banner',bannerController.showBanner),
router.post('/mainAboutBanner',imageController.upload.array('images7'),checkImage.checkMainBanner,(req, res, next) => {
          
  imageController.processImage(req, res, next, 1536, 500);
},bannerController.mainAboutBanner),
router.post('/dealerBanner',imageController.upload.array('images8'),checkImage.checkMainBanner,(req, res, next) => {
          
  imageController.processImage(req, res, next, 1536, 500);
},bannerController.dealerBanner),
router.post('/contactBanner',imageController.upload.array('images9'),checkImage.checkMainBanner,(req, res, next) => {
          
  imageController.processImage(req, res, next, 1536, 600);
},bannerController.contactBanner),




router.get('/viewSaved',async (req,res)=>{
          const products = await productModel.findOne({})
          res.render('admin/productsShow',{products})
})




module.exports = router;
