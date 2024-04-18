"use strict";

import express from "express";
import { authToken } from "../../middlewares.js";
import {
  getAllUsers,
  registerUser,
  getUserById,
  modifyUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers).post(registerUser);
userRouter.route("/:id").get(getUserById).put(authToken, modifyUser);

export default userRouter;
