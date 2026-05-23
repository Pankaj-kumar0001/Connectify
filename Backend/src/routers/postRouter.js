import express from "express";
import * as postcontroler from "../controllers/postControler.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const postRouter = express();


postRouter.post("/create", authMiddleware, postcontroler.createPost);

postRouter.get("/feed",postcontroler.feed);

postRouter.put("/:id/like", authMiddleware, postcontroler.likePost);

postRouter.post("/:id/comments",authMiddleware,postcontroler.addComment);




export default postRouter;