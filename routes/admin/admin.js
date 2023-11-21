const express = require("express");
const router = express.Router();



router.use(express.urlencoded({extended: true}));
// const multer = require('multer')
// const upload = multer({dest:'uploads/'})

const controller = require("../../controllers/admin/adminController");
const controllerUserManage = require("../../controllers/admin/adminUserManage");
const controllerCategory = require("../../controllers/admin/categoryController");
const controllerProducts = require('../../controllers/admin/productController');
const adminOrderController = require('../../controllers/admin/adminOrderController')
const productModel = require("../../models/productModel");
const imageController = require('../../controllers/imageController')

// admin
router.get("/", controller.getAdminLogin);
router.post("/postLogin", controller.postAdminLogin);
router.get("/getForgotPassword", controller.getForgotPassAdmin);
router.post("/forgotPassword", controller.postForgotPassAdmin);
router.post("/verifyOtp", controller.verifyOtp);
router.post("/updatePass", controller.updatePass);
router.post("/resendOtp", controller.resendOtp);
router.get('/home',controller.adminHome)


// customer management
router.get("/viewCustomers", controllerUserManage.viewCustomers);
// router.get("/editCustomers", controllerUserManage.editCustomers);
router.post("/updateUser", controllerUserManage.updateUser);
router.get("/blockUser", controllerUserManage.blockUser);
router.post("/searchUser", controllerUserManage.searchUser);
router.get("/searchView", controllerUserManage.searchView);
router.post("/sortUser", controllerUserManage.sortUser);
router.get("/sortUserView", controllerUserManage.sortUserView);

// product and category management
router.get("/createCategory", controllerCategory.createCategory);
router.post("/submitCategory", controllerCategory.submitCategory);
router.get('/viewEditCategory',controllerCategory.viewEditCategory)
router.post('/editCategory',controllerCategory.editCategory)
router.get('/deleteCategory',controllerCategory.deleteCategory)
router.get('/toggleList',controllerCategory.listToggle)

router.get('/addproducts',controllerProducts.addProductsView)
router.post('/saveproducts',imageController.upload.array('images'),imageController.processImage,controllerProducts.addProducts)
router.get('/viewproducts',controllerProducts.viewProducts)
router.get('/searchProductsView',controllerProducts.searchProductsView)
router.post('/searchProducts',controllerProducts.searchProducts)
router.get('/editProductsView',controllerProducts.editProductsView)
router.get('/deleteImage',controllerProducts.deleteImage)
// router.post('/editProducts',upload.array('images'),controllerProducts.editProducts)
router.get('/toggleListProducts',controllerProducts.toggleList)
router.get('/deleteProducts',controllerProducts.deleteProducts)

router.get('/orderDetails',adminOrderController.orderDetails)
router.get('/viewOrderDetails',adminOrderController.viewOrderDetails)
router.post('/updateOrderStatus',adminOrderController.updateOrderStatus)
router.get('/error',(req,res)=>{
          res.render('admin/admin/error')
})

router.get('/login',(req,res)=>{
          res.render('admin/admin/login')
})
router.get('/blank',(req,res)=>{
          res.render('admin/admin/blank')
})

router.get('/orders',(req,res)=>{
          res.render('admin/admin/pageorders')
})
router.get('/review',(req,res)=>{
          res.render('admin/admin/reviews')
})
router.get('/seller',(req,res)=>{
          res.render('admin/admin/sellercard')
})
router.get('/settings',(req,res)=>{
          res.render('admin/admin/settings')
})

router.get('/transaction',(req,res)=>{
          res.render('admin/admin/transaction')
})

router.get('/products',(req,res)=>{
          res.render('admin/admin/products2')
})
router.get('/category',(req,res)=>{
          res.render('admin/admin/category')
})
router.get('/viewSaved',async (req,res)=>{
          const products = await productModel.findOne({})
          res.render('admin/productsShow',{products})
})




module.exports = router;
