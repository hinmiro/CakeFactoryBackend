import express from "express";
import { authToken } from "../../middlewares.js";
import { getMe, postLogin } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.route("/login").post(postLogin);
authRouter.route("/me").get(authToken, getMe);

export default authRouter;
