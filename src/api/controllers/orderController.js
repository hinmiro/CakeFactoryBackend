"use strict";

import {
  addOrder,
  getAllOrders,
  getUserOrder,
  delOrder,
} from "../models/orderModel.js";

import {
  addUser,
  createGuestUser,
  getUserByUsername,
} from "../models/userModel.js";

const postOrder = async (req, res, next) => {
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
    console.log(req.body);
    result = await addOrder(req.body, guest.id);
  }
  if (!result) {
    const error = new Error("Unexpected error");
    error.status = 500;
    next(error);
  } else {
    res.status(201).json(result);
  }
};

const getOrders = async (req, res) => {
  try {
    res.json(await getAllOrders());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const result = await getUserOrder(req.params.id);
    if (result) {
      res.json(result);
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const result = await delOrder(req.params.id);
    if (result) {
      res.status(201).json({ message: "order posted" });
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putDelivery = async (req, res) => {
  try {
    const result = await deliverOrder(req.params.id);
    if (result) {
      res.status(201).json({ message: `order ${req.params.id} delivered` });
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { postOrder, getOrders, getUserOrders, deleteOrder, putDelivery };
