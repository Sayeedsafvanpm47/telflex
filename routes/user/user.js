const express = require('express')
const router = express.Router()


const controller = require('../../controllers/userController');


router.get('/',controller.getLogin)
router.post('/home',controller.postLogin)
router.get('/home',controller.getHome)
router.get('/signup',controller.getSignUp)
router.post('/signup',controller.postSignUp)

module.exports = router