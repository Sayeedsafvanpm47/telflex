const express = require("express");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));


const checkImage = require("../../middlewares/checkImageLength");

const controller = require("../../controllers/admin/adminController");
const controllerUserManage = require("../../controllers/admin/adminUserManage");
const controllerCategory = require("../../controllers/admin/categoryController");
const controllerProducts = require("../../controllers/admin/productController");
const adminOrderController = require("../../controllers/admin/adminOrderController");
const imageController = require("../../controllers/imageController");
const dashboardController = require("../../controllers/admin/adminDashboardController");
const offerController = require("../../controllers/admin/adminOfferController");
const bannerController = require("../../controllers/admin/adminBannerController");
const sessionCheck = require("../../middlewares/sessionMiddleware");
const productController = require("../../controllers/admin/productController");

// admin routes begins

// admincontroller routes begins

router.get("/home", sessionCheck.checkAdminSignIn, controller.adminHome);
router.get("/chart", sessionCheck.checkAdminSignIn, controller.chart);
router.get("/logout", controller.logout);
router.get("/editProfile", sessionCheck.checkAdminSignIn, controller.editProfile);
router.get("/customerenquiry", sessionCheck.checkAdminSignIn, controller.customerenquiry);
router.get("/dealerenquiry", sessionCheck.checkAdminSignIn, controller.dealerenquiry);

//admincontroller routes ends...

// adminUserManage routes begins

router.get("/viewCustomers", sessionCheck.checkAdminSignIn, controllerUserManage.viewCustomers);
router.get("/blockUser", sessionCheck.checkAdminSignIn, controllerUserManage.blockUser);
router.post("/searchUser", sessionCheck.checkAdminSignIn, controllerUserManage.searchUser);
router.get("/searchView", sessionCheck.checkAdminSignIn, controllerUserManage.searchView);
router.post("/sortUser", sessionCheck.checkAdminSignIn, controllerUserManage.sortUser);
router.get("/sortUserView", sessionCheck.checkAdminSignIn, controllerUserManage.sortUserView);

// adminuserManage routes ends...

// admindashboard routes begins

router.get("/salesReport", sessionCheck.checkAdminSignIn, dashboardController.salesReport);
router.post("/getReport", sessionCheck.checkAdminSignIn, dashboardController.getReport);
router.get("/getReportResults", sessionCheck.checkAdminSignIn, dashboardController.getReportResults);

// admindasboard routes ends...

// product and category management routes begins
router.get("/createCategory", sessionCheck.checkAdminSignIn, controllerCategory.createCategory);
router.post("/submitCategory", sessionCheck.checkAdminSignIn, controllerCategory.submitCategory);
router.get("/viewEditCategory", sessionCheck.checkAdminSignIn, controllerCategory.viewEditCategory);
router.post("/editCategory", sessionCheck.checkAdminSignIn, controllerCategory.editCategory);
router.get("/deleteCategory", sessionCheck.checkAdminSignIn, controllerCategory.deleteCategory);
router.get("/toggleList", sessionCheck.checkAdminSignIn, controllerCategory.listToggle);
router.get("/reviews", sessionCheck.checkAdminSignIn, productController.reviews);
router.get("/reviewVisibility", sessionCheck.checkAdminSignIn, productController.reviewVisibility);
router.get("/addproducts", sessionCheck.checkAdminSignIn, controllerProducts.addProductsView);
router.post(
	"/saveproducts",
	sessionCheck.checkAdminSignIn,
	imageController.upload.array("images"),
	(req, res, next) => {
		imageController.processImage(req, res, next, 720, 720);
	},
	controllerProducts.addProducts
);
router.get("/viewproducts", sessionCheck.checkAdminSignIn, controllerProducts.viewProducts);
router.get("/searchProductsView", sessionCheck.checkAdminSignIn, controllerProducts.searchProductsView);
router.post("/searchProducts", sessionCheck.checkAdminSignIn, controllerProducts.searchProducts);
router.get("/editProductsView", sessionCheck.checkAdminSignIn, controllerProducts.editProductsView);
router.get("/deleteImage", sessionCheck.checkAdminSignIn, controllerProducts.deleteImage);
router.post(
	"/editProducts",
	sessionCheck.checkAdminSignIn,
	imageController.upload.array("images"),
	(req, res, next) => {
		imageController.processImage(req, res, next, 720, 720);
	},
	controllerProducts.editProducts
);
router.get("/toggleListProducts", sessionCheck.checkAdminSignIn, controllerProducts.toggleList);

// product and category management routes ends...

// admin order controller routes begins

router.get("/orderDetails", sessionCheck.checkAdminSignIn, adminOrderController.orderDetails);
router.get("/viewOrderDetails", sessionCheck.checkAdminSignIn, adminOrderController.viewOrderDetails);
router.post("/updateOrderStatus", sessionCheck.checkAdminSignIn, adminOrderController.updateOrderStatus);
router.post("/orderSearchResults", sessionCheck.checkAdminSignIn, adminOrderController.orderSearchResults);

// admin order controller routes ends...

// admin offer management routes begins

router.get("/getProductOffers", sessionCheck.checkAdminSignIn, offerController.getproductOffer);
router.post("/productOffer", sessionCheck.checkAdminSignIn, offerController.productOffer);
router.get("/getCategoryOffer", sessionCheck.checkAdminSignIn, offerController.getCategoryOffer);
router.post("/offerCategory", sessionCheck.checkAdminSignIn, offerController.offerCategory);
router.get("/getcouponOffer", sessionCheck.checkAdminSignIn, offerController.getCouponOffer);
router.post("/saveCoupon", sessionCheck.checkAdminSignIn, offerController.saveCoupon);
router.post("/updateCoupon", sessionCheck.checkAdminSignIn, offerController.updateCoupon);
router.get("/couponStatus", sessionCheck.checkAdminSignIn, offerController.couponStatus);
router.get("/showRefferals", sessionCheck.checkAdminSignIn, offerController.showRefferals);

// admin offer management route ends...

// admin  banner management controller begins

// deals banner
router.post(
	"/dealsBanner",
	sessionCheck.checkAdminSignIn,
	imageController.upload.array("images1"),
	checkImage.checkDealsBanner,
	(req, res, next) => {
		imageController.processImage(req, res, next, 636, 439);
	},
	bannerController.dealsBanner
);
// festival banner
router.post(
	"/festivalBanner",
	sessionCheck.checkAdminSignIn,
	imageController.upload.array("images5"),
	checkImage.checkDealsBanner,
	(req, res, next) => {
		imageController.processImage(req, res, next, 636, 439);
	},
	bannerController.festivalBanner
);
// main banner
router.post(
	"/mainBanner",
	sessionCheck.checkAdminSignIn,
	imageController.upload.array("images2"),
	checkImage.checkMainBanner,
	(req, res, next) => {
		imageController.processImage(req, res, next, 731, 470);
	},
	bannerController.mainBanner
),
	// about banner

	router.post(
		"/aboutBanner",
		sessionCheck.checkAdminSignIn,
		imageController.upload.array("images6"),
		checkImage.checkMainBanner,
		(req, res, next) => {
			imageController.processImage(req, res, next, 731, 470);
		},
		bannerController.aboutBanner
	),
	// sub banner

	router.post(
		"/subBanner",
		sessionCheck.checkAdminSignIn,
		imageController.upload.array("images3"),
		checkImage.checkSubBanner,
		(req, res, next) => {
			imageController.processImage(req, res, next, 1296, 295);
		},
		bannerController.subBanner
	);

// offer banner
router.post(
	"/offerBanner",
	sessionCheck.checkAdminSignIn,
	imageController.upload.array("images4"),
	checkImage.checkOfferBanner,
	(req, res, next) => {
		imageController.processImage(req, res, next, 416, 177);
	},
	bannerController.offerBanner
);

// main about banner
router.post(
	"/mainAboutBanner",
	sessionCheck.checkAdminSignIn,
	imageController.upload.array("images7"),
	checkImage.checkMainBanner,
	(req, res, next) => {
		imageController.processImage(req, res, next, 731, 470);
	},
	bannerController.mainAboutBanner
),
	// dealer banner
	router.post(
		"/dealerBanner",
		sessionCheck.checkAdminSignIn,
		imageController.upload.array("images8"),
		checkImage.checkMainBanner,
		(req, res, next) => {
			imageController.processImage(req, res, next, 731, 470);
		},
		bannerController.dealerBanner
	),
	// contact banner
	router.post(
		"/contactBanner",
		sessionCheck.checkAdminSignIn,
		imageController.upload.array("images9"),
		checkImage.checkMainBanner,
		(req, res, next) => {
			imageController.processImage(req, res, next, 731, 470);
		},
		bannerController.contactBanner
	),
	// manufacturing images
	router.post(
		"/manufacturing",
		sessionCheck.checkAdminSignIn,
		imageController.upload.array("images10"),
		(req, res, next) => {
			imageController.processImage(req, res, next, 731, 470);
		},
		bannerController.manufacturing
	),
	// factory images
	router.post(
		"/factory",
		sessionCheck.checkAdminSignIn,
		imageController.upload.array("images11"),
		(req, res, next) => {
			imageController.processImage(req, res, next, 731, 470);
		},
		bannerController.factory
	),
	// view all banners routes
	router.get("/banner", sessionCheck.checkAdminSignIn, bannerController.showBanner),
	// admin banner management ends...

  // admin routes end...

	(module.exports = router);
