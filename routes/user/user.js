const express = require('express')
const router = express.Router()

const controller = require('../../controllers/userController');

router.get('/',controller.getLogin)
router.post('/postLogin',controller.postLogin)
router.get('/gethome',controller.getHome)
router.get('/getsignup',controller.getSignUp)
router.post('/signup',controller.postSignUp)
router.post('/resendOtp',controller.resendOtp)
router.post('/verifyOtp',controller.verifyOTP)
router.get('/getForgotPassword',controller.getForgotPassword)
router.post('/forgotPassword',controller.forgotPassword)
router.post('/updatePass',controller.updatePass)
module.exports = router