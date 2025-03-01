const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    problems:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Problem'
        }
    ]
})

const User=mongoose.model('user',userSchema);


module.exports=User