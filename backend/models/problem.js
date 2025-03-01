const { timeStamp } = require('console');
const mongoose=require('mongoose')

const problemSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },
    notes:{
        type:String,
   
    },
    topic:{
        type:String,
        required:true
    },
    time:{
        type:Number,
        required:true
    }
    
},{timeStamp:true})

const Problem=mongoose.model('Problem',problemSchema);


module.exports=Problem