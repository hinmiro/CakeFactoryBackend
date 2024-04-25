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

const orderRouter = express.Router();

orderRouter
  .route("/")
  .post(optionalAuthToken, postOrder)
  .get(authToken, validationErrors, getOrders);

orderRouter
  .route("/:id")
  .get(authToken, getUserOrders)
  .delete(authToken, validationErrors, deleteOrder)
  .put(authToken, validationErrors, putDelivery);

//orderRouter.route('/delivered/:id')

export default orderRouter;
