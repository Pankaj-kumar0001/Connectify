import express from "express";
//import { registerUser } from "../controllers/usercontroler.js";
import * as authcontroler from "../controllers/usercontroler.js";
import { followUnfollow } from "../controllers/postControler.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authcontroler.registerUser);

router.post("/login", authcontroler.loginUser);

router.get("/profile", authMiddleware, authcontroler.getProfile);

router.get("/refresh-token", authcontroler.refreshAccessToken);

router.get("/logout", authcontroler.logout);

router.put("/:id/follow", authMiddleware,followUnfollow);

export default router;


