import express from "express";
import * as postcontroler from "../controllers/postControler.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const postRouter = express();


postRouter.post("/", authMiddleware, postcontroler.createPost);

postRouter.get("/feed",postcontroler.feed);

postRouter.put("/:id/like", authMiddleware, postcontroler.likePost);

postRouter.post("/:id/comment",authMiddleware,postcontroler.addComment);

postRouter.delete("/:id",authMiddleware,postcontroler.deletePost);

postRouter.put("/:id", authMiddleware, postcontroler.updatePost);




export default postRouter;