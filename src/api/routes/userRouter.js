"use strict";

import express from "express";
import {
  getAllUsers,
  registerUser,
  getUserById,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers).post(registerUser);
userRouter.route("/:id").get(getUserById);

export default userRouter;
