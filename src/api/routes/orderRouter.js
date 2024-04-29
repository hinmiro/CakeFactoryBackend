"use strict";

import express from "express";
import {
  postOrder,
  getOrders,
  getUserOrders,
  deleteOrder,
  putDelivery,
} from "../controllers/orderController.js";
import {
  authToken,
  validationErrors,
  optionalAuthToken,
} from "../../middlewares.js";
import { body } from "express-validator";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .post(
    optionalAuthToken,
    body("price").trim().notEmpty().isNumeric(),
    body("date").trim().notEmpty().isDate(),
    postOrder,
  )
  .get(authToken, validationErrors, getOrders);

orderRouter
  .route("/:id")
  .get(authToken, validationErrors, getUserOrders)
  .delete(authToken, validationErrors, deleteOrder)
  .put(authToken, validationErrors, putDelivery);

export default orderRouter;
