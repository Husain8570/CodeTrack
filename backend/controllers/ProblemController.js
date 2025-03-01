const express=require('express');
const Problem = require('../models/problem');
const auth=require('../middleware/authentication');
const User = require('../models/user');



const addproblem=async (req,res)=>{
    const {title,url,notes,topic,time}=req.body;

    if(!title || !url || !topic || !time  ){
        return res.json({
            success:false,
            msg:"All fields are required"
        })
    }
    const problem=await Problem.create(req.body);
    const username=req.username
    
    const user=await User.findOne({username});
    
    user.problems.push(problem._id);
    
    await user.save();
    res.json({
        success:true,
        msg:"Problem added successfully"
    })
}

const getproblems=async (req,res)=>{
    try{
        const username=req.username;
    const user=await User.findOne({username}).populate('problems');
    
    res.status(200).json({
        success:true,
        problems:user.problems
    });
    }

    catch(err){
        res.status(500).json({
            success:false,
            msg:"Server error"
        });
    }
}


const deleteproblem=async (req,res)=>{
    try{
        const {id}=req.params;
    const username=req.username;

    const user=await User.findOne({username});

    await Problem.deleteOne({_id:id});
    const problems=user.problems.filter((val)=>(val!=id))
    user.problems=problems;

    await user.save()
    res.status(200).json({
        success:true,
        msg:"Problem deleted successfully"
    })
    }
    catch{
        res.status(500).json({
            success:false,
            msg:"Server error"
        })
    }
}

module.exports={addproblem,getproblems,deleteproblem}