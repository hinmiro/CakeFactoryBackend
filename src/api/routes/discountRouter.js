"use strict";

import express from "express";
import { authToken } from "../../middlewares.js";
import {
  getAllDiscounts,
  postDiscount,
  deleteDiscount,
  checkDiscount,
} from "../controllers/discountController.js";

const discountRouter = express.Router();

discountRouter
  .route("/")
  .get(authToken, getAllDiscounts)
  .post(authToken, postDiscount)
  .put(authToken, checkDiscount);

discountRouter.route("/:id").delete(authToken, deleteDiscount);

export default discountRouter;
