"use strict";

import express from "express";
import { authToken, validationErrors } from "../../middlewares.js";
import {
  getAllUsers,
  registerUser,
  getUserById,
  modifyUser,
  deleteUser,
} from "../controllers/userController.js";
import { body } from "express-validator";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getAllUsers)
  .post(
    body("name").trim(),
    body("street_num").trim().isNumeric().notEmpty(),
    body("zip_code").isNumeric().notEmpty(),
    body("city").trim().notEmpty(),
    body("username").trim().notEmpty(),
    body("password").trim().notEmpty().isLength({ min: 5 }),
    validationErrors,
    registerUser,
  );

userRouter
  .route("/:id")
  .get(getUserById)
  .put(authToken, validationErrors, modifyUser)
  .delete(authToken, validationErrors, deleteUser);

export default userRouter;
