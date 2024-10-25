const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique: true,
        required: true,
    },
    email:{
        type:String,
        unique: true,
        required: true,
    },
    password:{
        type:String,
        unique:true,
        required: true,
    },
    podcasts:[          //array type bcs user can update orr manage multiple podcasts
        {
            type:mongoose.Types.ObjectId,
            ref:"podcast",
        },
    ]
},{timestamps:true})            //timestamp issliye taaki user ka jbb bhi data update ho wo automatically podcasts model m bhi store hota jaye.


const user=mongoose.model("user",userSchema);

module.exports=user;