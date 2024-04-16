"use strict";

import express from "express";
import { listAllUsers, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/").get(listAllUsers).post(registerUser);

export default userRouter;
