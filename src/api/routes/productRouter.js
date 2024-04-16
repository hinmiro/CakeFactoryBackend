'use strict';
import express from "express";
import {postProduct} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.route('/').post(postProduct);

export default productRouter;
