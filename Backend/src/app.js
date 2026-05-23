import express from "express";
import router from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import postRoute from "./routers/postRouter.js";




const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/users/",router);
app.use("/api/posts",postRoute);
app.get("/",(req,res)=>{

    res.send("Backend is running on Server 5000");
})






export default app;