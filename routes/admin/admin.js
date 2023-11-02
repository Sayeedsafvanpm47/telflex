const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/adminController");
const controllerUserManage = require("../../controllers/admin/adminUserManage");
const controllerCategory = require("../../controllers/admin/categoryController");

router.get("/", controller.getAdminLogin);
router.post("/postLogin", controller.postAdminLogin);
router.get("/getForgotPassword", controller.getForgotPassAdmin);
router.post("/forgotPassword", controller.postForgotPassAdmin);
router.post("/verifyOtp", controller.verifyOtp);
router.post("/updatePass", controller.updatePass);
router.post("/resendOtp", controller.resendOtp);
router.get("/viewCustomers", controllerUserManage.viewCustomers);
router.get("/editCustomers", controllerUserManage.editCustomers);
router.post("/updateUser", controllerUserManage.updateUser);
router.get("/blockUser", controllerUserManage.blockUser);
router.post("/searchUser", controllerUserManage.searchUser);
router.get("/searchView", controllerUserManage.searchView);
router.post("/sortUser", controllerUserManage.sortUser);
router.get("/sortUserView", controllerUserManage.sortUserView);

router.get("/createCategory", controllerCategory.createCategory);
router.post("/submitCategory", controllerCategory.submitCategory);
router.get('/viewEditCategory',controllerCategory.viewEditCategory)
router.post('/editCategory',controllerCategory.editCategory)
router.get('/deleteCategory',controllerCategory.deleteCategory)
router.get('/toggleList',controllerCategory.listToggle)
router.get('/toggleunList',controllerCategory.unlistToggle)
router.get('/addproducts',(req,res)=>{
          res.render('admin/admin/add_product_1')
})
router.get('/error',(req,res)=>{
          res.render('admin/admin/error')
})
router.get('/home',(req,res)=>{
          res.render('admin/admin/home')
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
          res.render('admin/admin/products')
})
router.get('/category',(req,res)=>{
          res.render('admin/admin/category')
})



module.exports = router;
