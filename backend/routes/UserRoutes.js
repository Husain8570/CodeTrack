const express=require('express')
const User=require('../models/user.js')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
const auth=require('../middleware/authentication.js')
const {login,signup,logout,authenticate,user} =require('../controllers/UserController.js')

const validate=require('../middleware/validate.js')
const {loginSchema,signupSchema}=require('../validation/authvalidation.js')


const router=express.Router();
dotenv.config();

const jwt_secret=process.env.JWT_SECRET


router.get('/',auth,authenticate)

router.post('/login',validate(loginSchema),login)
router.post('/signup',validate(signupSchema), signup);

router.get('/logout',auth,logout)

router.get('/user',auth,user)


module.exports=router