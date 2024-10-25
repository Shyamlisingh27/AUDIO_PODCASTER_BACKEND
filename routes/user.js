const express=require("express");
const bcrypt=require("bcryptjs");         //to hash password
const jwt=require("jsonwebtoken")
const authMiddleware=require("../middleware/authMiddleware")

const router=express.Router();

const User=require("../models/user");

//signup - route
router.post("/signup", async(req,res)=>{
    try{
        const {username,email,password} =req.body;
        if(!username || !email || !password){
            return res.status(400).json(
                {message:"All fiels are required."}
            )
        }
        if(username.length<5){
            return res.status(400).json({message:"username must have 5 characters."})
        }
        if(password.length<6){
            return res.status(400).json({message:"password must have 6 characters."})
        }

        //check if user exists 
        const existingEmail=await User.findOne({email: email });
        const existingUsername=await User.findOne({username: username });
        if(existingEmail||existingUsername){
            return res.status(400).json({message:"username or email already exists"})
        }

        //if user does not exist then bcrypt the password and create user
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt);

        const newuser= new User({username,email,password:hashedpassword});
        await newuser.save();       //save data to database
        return res.status(200).json({message:"Account created"})
    }
    catch(error){
        
        res.status(500).json({error})
        
    }
})


//login-in route
router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json(
                {message:"All fiels are required."}
            )
        }
        

    //check if user does not exist
    const existingUser = await User.findOne({ email: email });
    //agr email exist krra h db m to uss user ka data exixtingUser m aa jayega
    if(!existingUser){
        return res.status(400).json({message:"user does not existing.Please Signin first."})
    }


    //check if password matches or not
    const isMatch = await bcrypt.compare(password, existingUser.password);
     //if db m exixting user ka password == entered password then true
    if(!isMatch){
        return res.status(400).json({message:"Incorrect password."})
    }

    //if user exists then generate JWT token
    const token=jwt.sign(
        {
            id:existingUser._id,
            email:existingUser.email
        },
        process.env.secretKey,
        {
            expiresIn:"30d"
        }
    )

    //generate cookie
    res.cookie("podcasterUserToken",token,{         //pass name of cookie, token and
        httpOnly:true,
        maxAge:30*24*60*60*100, //30 days
        secure:process.env.node_env==="production",
        sameSite:"None"
    })

    return res.status(200).json({
        id: existingUser._id,
        username: existingUser.username,
        email: email,
        message: "Login successful"
    });
    
    }
    catch(error){
        
        res.status(500).json({error})
        
    }
})

//logout route
router.post("/logout", async (req, res) => {        //cookie delete krne se user details hatt jata h jo login hua tha uss user ka...means wo logout ho jata h
    res.clearCookie("podcasterUserToken", {
        httpOnly: true,
    });
    res.status(200).json({ message: "Logged Out." });
});


//check cookie/Token present or not
router.get("/check-cookie", async (req, res) => {
    const token = req.cookies.podcasterUserToken;
    if (token) {
        return res.status(200).json({ message: true });
    }
    return res.status(200).json({ message: false });
});


//route to fetch user details
router.get("/user-details",authMiddleware,async(req,res)=>{
    try{
        const {email}=req.user;
        const existingUser=await User.findOne({email:email}).select(
            "-password"
        );
        return res.status(200).json({
            user: existingUser,

        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
        
    }
})

module.exports=router;