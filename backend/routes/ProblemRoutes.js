const express=require('express');
const Problem = require('../models/problem');
const auth=require('../middleware/authentication');
const User = require('../models/user');
const {addproblem,deleteproblem,getproblems}=require('../controllers/ProblemController')

const router=express.Router()


router.post('/add',auth,addproblem)

router.get('/',auth,getproblems)

router.delete('/delete/:id',auth,deleteproblem)



module.exports=router