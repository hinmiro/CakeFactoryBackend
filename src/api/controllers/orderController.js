"use strict";

import {
  addOrder,
  getAllOrders,
  getUserOrder,
  delOrder,
  deliverOrder,
} from "../models/orderModel.js";

import { addUser, getUserByUsername } from "../models/userModel.js";

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
      const guestUser = await addUser(guestUserBody);
      const guest = await getUserByUsername(guestUser);
      result = await addOrder(req.body, guest.id);
    }
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const result = await getAllOrders(res.locals.user);
    if (!result) {
      res.status(403).json({ message: "Only for admins eyes" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const result = await getUserOrder(req.params.id, res.locals.user);
    if (result) {
      res.json(result);
    } else {
      res.status(400);
    }
  } catch (error) {
    next(error);
  }
};

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

const putDelivery = async (req, res, next) => {
  try {
    const result = await deliverOrder(req.params.id);
    if (result) {
      res.status(201).json({ message: `order ${req.params.id} delivered` });
    } else {
      res.status(400);
    }
  } catch (error) {
    next(error);
  }
};

export { postOrder, getOrders, getUserOrders, deleteOrder, putDelivery };
