const multer=require("multer");     //helps to upload files from frontend into backend

//set storage
const storage=multer.diskStorage({      //system k hardrive m hi store hoga files
    destination:(req,file,cb)=>{
        cb(null,"uploads/");        //iss uploads naam ka folder m store hoga
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

//initialize upload
const upload=multer({
    storage:storage
}).fields([
    {name:"frontImage", maxCount:1},
    {name:"audioFile", maxCount:1}
])



module.exports=upload;