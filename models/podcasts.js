const mongoose=require("mongoose");

const podcast=new mongoose.Schema({
    frontImage:{
        type:String,
        unique:true,
        required:true,
    },
    audioFile:{
        type:String,
        unique:true,
        required:true,
    },
    title:{
        type:String,
        unique:true,
        required:true,
    },
    description:{
        type:String,
        unique:true,
        required:true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",     //reference user model
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"category",     //reference category model
    },
},{timestamps:true})

module.exports = mongoose.model("podcast",podcast);      

