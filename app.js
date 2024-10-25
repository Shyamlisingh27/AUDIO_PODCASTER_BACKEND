const express=require("express");
const app=express();            //to require functionalities of express in app constant
const cookieparser=require("cookie-parser")

const cors = require('cors');
app.use(cors({
    origin:["https://audio-podcast.vercel.app"],   //giving access of resources of server to webpage (frontend) running at port 5173 (jha se data aa rha h server p)
    credentials:true,
}));

require("dotenv").config();
require("./conn/conn");

const PORT=process.env.PORT;

const userRoute=require("./routes/user");
const categoryRoute=require("./routes/category");
const podcastApi=require("./routes/podcast");

//middleware
app.use(express.json());
app.use(cookieparser());

//we need to use uploads folder created which contains the data which we add during adding podcasts and then we can get these frontimage and audiofiles for showing all podcasts
app.use("/uploads",express.static("uploads"))

//routes

app.use("/api/v1",userRoute);
app.use("/api/v1",categoryRoute);
app.use("/api/v1",podcastApi)

app.listen(PORT,()=>{
    console.log(`server started at port no: ${PORT}`);
    //conn.db;
})