const express=require("express");
const Cat=require("../models/category")
const router=express.Router();

//add-category
router.post("/add-category",async(req,res)=>{
    const { categoryName }=req.body;
    const category=new Cat({       //create new category
        categoryName
    });
    await category.save();
    return res.status(200).json({message:"category added."})
})

module.exports=router;