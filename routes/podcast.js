const express=require("express")
const router=express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const Category=require("../models/category")
const Podcast=require("../models/podcasts");
const User=require("../models/user")

//add-podcast
router.post("/add-podcast",authMiddleware,upload,async(req,res)=>{        //only authenticated user can add podcast
    try{
        const {title,description,category} = req.body;
        const frontImage=req.files["frontImage"][0].path;
        const audioFile=req.files["audioFile"][0].path;
        if(!title||!description||!category||!frontImage||!audioFile){
            return res.status(400).json({message:"All fields are required."});
        }
        const {user} =req;
        const cat=await Category.findOne({categoryName:category});
        if(!cat){
            return res.status(400).json({message:"No category found."});
        }
        const catid=cat._id;
        const userid=user._id;
        const newPodcast=new Podcast({      //creating new podcast
            title,
            description,
            category:catid,
            frontImage,
            audioFile,
            user: userid,
        })    
        await newPodcast.save();
        //to update podcast in that particular category in which it is added, after adding 
        await Category.findByIdAndUpdate(catid,{
            $push:{podcasts: newPodcast._id},       //category model m podcast array field k andar new podcast add krr do
        })  
        await User.findByIdAndUpdate(userid,{   //to update the new podcast in user model
            $push:{podcasts:newPodcast._id}
        })
        res.status(201).json({message:"Podcast added Successfully."})
    }
    catch(error){
        console.log(error);
        
        return res.status(500).json({message:"Failed to add podcast."})
    }
})


//get all podcast api
router.get("/get-podcast", async(req,res)=>{
    try{
        //get all podcasts and populate by category means jis category ka h wo podcast wo bhi dikhao
        const podcasts=await Podcast.find()
            .populate("category")
            .sort({createdAt:-1});       //createdat -1 will sort all the podcasts in descendind order means most recent comes 1st
        return res.status(200).json({data:podcasts})
    }
    catch(error){
        return res.status(500).json({message:"Interenal server error"})
    }
})


//get user podcasts
router.get("/get-user-podcast", authMiddleware ,async(req,res)=>{
    try{
        const {user}=req;
        const userid=user._id;
        const data=await User.findById(userid)
            .populate({
                path: "podcasts",
                populate: {path:"category"},
            })
            .select("-password");   //dont send password with user issliye user k data se password ko minus kerr do
            if(data && data.podcasts){
                data.podcasts.sort(
                    (a,b)=> new Date(b.createdAt) - new Date(a.createdAt)
                )
            }
            return res.status(200).json({data: data.podcasts})
    }
    catch(error){
        return res.status(500).json({message:"Interenal server error"})
    }
})


//get podcasts by id
router.get("/get-podcast/:id", async(req,res)=>{
    try{
        const {id}=req.params;
        const podcasts=await Podcast.findById(id).populate("category");
        
        return res.status(200).json({data:podcasts})
    }
    catch(error){
        return res.status(500).json({message:"Interenal server error"})
    }
})

//get podcasts by categories
router.get("/category/:cat", async(req,res)=>{
    try{
        const {cat}=req.params;
        const categories=await Category.find({categoryName:cat}).populate({
            path:"podcasts",
            populate:{path:"category"},
        });
        let podcasts=[];
        categories.forEach((category)=>{
            podcasts=[...podcasts,...category.podcasts]
        })
        return res.status(200).json({data:podcasts})
    }
    catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
})

module.exports=router;