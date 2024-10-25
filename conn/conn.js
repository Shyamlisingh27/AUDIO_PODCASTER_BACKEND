const mongoose=require("mongoose")

const conn=async()=>{
    try{
        await mongoose.connect(`${process.env.DB}`);
        console.log("connection succesful")
    }
    catch(error){
        console.log(error)
    }
}

conn();