"use strict";

import promisePool from "../../utils/database.js";
import { createGuestUser } from "./userModel.js";

const addOrder = async (body, userId) => {
  const { price, date } = body;
  const sql = `INSERT INTO orders (price, date, orderer) VALUES (?, ?, ?)`;
  const params = [price, date, userId];
  const [rows] = await promisePool.execute(sql, params);
  if (rows.affectedRows === 0) return false;
  return { message: "Order places" };
};

const getAllOrders = async (user) => {
  if (user.access !== "admin") {
    return false;
  }
  const [orders] = await promisePool.execute("SELECT * from orders");
  return orders;
};

const getUserOrder = async (id, user) => {
  if (user.access !== "admin" || user.access !== "user") {
    return false;
  }
  const [rows] = await promisePool.execute(
    "SELECT * from orders WHERE orderer = ?",
    [id],
  );
  if (rows.length === 0) {
    return false;
  }
  return rows;
};

const delOrder = async (id, user) => {
  if (user.access !== "admin") {
    return { message: "Unauthorized" };
  }
  const sql = "DELETE FROM orders WHERE id = ?";
  const [result] = await promisePool.execute(sql, [id]);
  return result.affectedRows !== 0;
};

const deliverOrder = async (id) => {
  try {
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    const status = 1;
    const [result] = await promisePool.execute(sql, [status, id]);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error delivering order:", error);
    return false; // Return false to indicate that there was an error
  }
};

// Todo: Update order write function??

export { addOrder, getAllOrders, getUserOrder, delOrder, deliverOrder };
