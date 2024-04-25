"use strict";

import express from "express";
import { authToken } from "../../middlewares.js";
import {
  getAllDiscounts,
  postDiscount,
  deleteDiscount,
} from "../controllers/discountController.js";

const discountRouter = express.Router();

discountRouter
  .route("/")
  .get(authToken, getAllDiscounts)
  .post(authToken, postDiscount)
  .delete(authToken, deleteDiscount);

export default discountRouter;
