"use strict";

import express from "express";
import { authToken } from "../../middlewares.js";
import { getAllDiscounts, addNewCode } from "../controllers/discountController.js";

const discountRouter = express.Router();

discountRouter.route("/").get(authToken, getAllDiscounts).post(authToken, addNewCode);


export default discountRouter;
