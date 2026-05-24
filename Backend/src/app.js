import express from "express";
import router from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import postRoute from "./routers/postRouter.js";
import cors from "cors"



const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/users/",router);
app.use("/api/posts",postRoute);
app.get("/",(req,res)=>{

    res.send("Backend is running on Server 5000");
})






export default app;