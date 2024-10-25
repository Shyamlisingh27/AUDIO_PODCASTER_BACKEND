const jwt=require("jsonwebtoken");
const User=require("../models/user");

const authMiddleware=async(req,res,next)=>{
    const token=req.cookies.podcasterUserToken;
    try{
        //if token exists then decode the token and verify user
        if(token){
            const decode=jwt.verify(token,process.env.secretKey);
            const user=await User.findById(decode.id);

            if(!user){
                return res.status(404).json({message:"user not found"});
            }
            req.user=user;
            next();
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"invalid token."})
        
    }
}

module.exports=authMiddleware;