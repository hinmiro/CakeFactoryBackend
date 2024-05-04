"use strict";

import promisePool from "../../utils/database.js";
import { createGuestUser } from "./userModel.js";

const addOrder = async (body, userId) => {
  try {
    const { price, date, products, street_name, street_num, zip_code, city } =
      body;
    const sql = `INSERT INTO orders (price, date, orderer, street_name, street_num, zip_code, city) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().split("T")[0];
    const params = [
      price,
      formattedDate,
      userId,
      street_name,
      street_num,
      zip_code,
      city,
    ];
    const [rows] = await promisePool.execute(sql, params);
    if (rows.affectedRows === 0) return false;

    const insertProductOrder =
      "INSERT INTO orders_products (order_id, product_id, quantity) VALUES (?, ?, 1) " +
      "ON DUPLICATE KEY UPDATE quantity = quantity + 1";

    await Promise.all(
      products.map(async (id) => {
        const [insertRows] = await promisePool.execute(insertProductOrder, [
          rows.insertId,
          id,
        ]);
      }),
    );
    return { message: "Order places" };
  } catch (err) {
    console.log(err.message);
    return false;
  }
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
  await promisePool.execute("DELETE FROM orders_products WHERE order_id = ?", [
    id,
  ]);
  const sql = "DELETE FROM orders WHERE id = ?";
  const [result] = await promisePool.execute(sql, [id]);
  if (result.affectedRows === 0) return { message: "invalid" };
  return { message: "success" };
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
    return false;
  }
};

export { addOrder, getAllOrders, getUserOrder, delOrder, deliverOrder };
