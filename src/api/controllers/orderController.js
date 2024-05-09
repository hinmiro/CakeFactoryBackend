"use strict";

import {
  addOrder,
  getAllOrders,
  getUserOrder,
  delOrder,
  deliverOrder,
} from "../models/orderModel.js";

import { addUser, getUserByUsername } from "../models/userModel.js";

/**
 * @api {post} /v1/orders Add Order
 * @apiName PostOrder
 * @apiGroup Order
 *
 * @apiParam {Object} order Order details.
 *
 * @apiSuccess {Object} result Order details.
 *
 * @apiError InternalServerError Error while adding the order.
 */
const postOrder = async (req, res, next) => {
  try {
    let result;
    if (res.locals.user) {
      result = await addOrder(req.body, res.locals.user.id);
    } else {
      const { name, street_name, street_num, zip_code, city } = req.body;
      const guestUserBody = {
        name: name,
        street_name: street_name,
        street_num: street_num,
        zip_code: zip_code,
        city: city,
      };
      const [guestUser] = await addUser(guestUserBody);
      const guest = await getUserByUsername(guestUser.username);
      result = await addOrder(req.body, guest.id);
    }
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * @api {get} /v1/orders Get All Orders
 * @apiName GetOrders
 * @apiGroup Order
 *
 * @apiHeader {String} Authorization JWT token of the user.
 *
 * @apiSuccess {Object[]} orders List of all orders.
 *
 * @apiError Unauthorized Only admin can access.
 * @apiError InternalServerError Internal server error.
 */
const getOrders = async (req, res, next) => {
  try {
    const result = await getAllOrders(res.locals.user);
    if (result.message === "unauthorized") {
      res.status(403).json({ message: "Only for admins eyes" });
    }

    if (!result) {
      res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @api {get} /v1/orders/:id Get User Orders
 * @apiName GetUserOrders
 * @apiGroup Order
 *
 * @apiHeader {String} Authorization JWT token of the user.
 * @apiParam {Number} id ID of the user.
 *
 * @apiSuccess {Object[]} orders List of user's orders.
 *
 * @apiError BadRequest Invalid user id.
 */
const getUserOrders = async (req, res, next) => {
  try {
    const result = await getUserOrder(req.params.id, res.locals.user);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @api {delete} /v1/orders/:id Delete Order
 * @apiName DeleteOrder
 * @apiGroup Order
 *
 * @apiHeader {String} Authorization JWT token of the user.
 * @apiParam {Number} id ID of the order to delete.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError Unauthorized Only admin can delete orders.
 * @apiError BadRequest Invalid order id.
 */
const deleteOrder = async (req, res, next) => {
  try {
    const result = await delOrder(req.params.id, res.locals.user);
    if (result.message === "Unauthorized") {
      res.status(403).json({ message: "Only admins can delete orders" });
    } else if (result.message === "success") {
      res.status(200).json({ message: "Order deleted" });
    } else {
      res.status(400).json({ message: `No order found with id` });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @api {put} /v1/orders/:id/delivery Deliver Order
 * @apiName PutDelivery
 * @apiGroup Order
 *
 * @apiHeader {String} Authorization JWT token of the user.
 * @apiParam {Number} id ID of the order to deliver.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError Unauthorized Only admin can alter orders.
 * @apiError BadRequest Invalid order id.
 */
const putDelivery = async (req, res, next) => {
  try {
    const result = await deliverOrder(req.params.id, res.locals.user);
    if (result.message === "unauthorized") {
      res.status(403).json({ message: "Only admins can alter orders" });
    }
    if (result.message === "success") {
      res.status(201).json({ message: `order ${req.params.id} delivered` });
    } else {
      res.status(400).json({ message: "Invalid id" });
    }
  } catch (error) {
    next(error);
  }
};

export { postOrder, getOrders, getUserOrders, deleteOrder, putDelivery };
