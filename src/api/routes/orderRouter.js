'use strict';

import express from "express";
import {postOrder, getOrders, getUserOrders, deleteOrder, putDelivery} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.route('/').post(postOrder).get(getOrders);
orderRouter.route('/:id').get(getUserOrders).delete(deleteOrder).put(putDelivery);

export default orderRouter;
