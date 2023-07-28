const express=require('express')
const { register, logOut, login, refreshToken } = require('../controllers/userController')
const verifyToken = require('../middlewares/token-authentication')
const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/logout',verifyToken, logOut)
router.post('/token',refreshToken)

module.exports=router