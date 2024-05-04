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
    return { message: "unauthorized" };
  }

  try {
    const [orders] = await promisePool.execute("SELECT * from orders");

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const [orderProducts] = await promisePool.query(
          "SELECT p.*, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ?",
          [order.id],
        );

        const [orderer] = await promisePool.query(
          "SELECT * FROM users WHERE id = ?",
          [order.orderer],
        );

        const orderDetails = {
          id: order.id,
          price: order.price,
          date: order.date,
          status: order.status,
          orderer: orderer[0],
          products: [],
        };

        orderProducts.forEach((product) => {
          for (let i = 0; i < product.quantity; i++) {
            let productCopy = { ...product };
            delete productCopy.quantity;
            orderDetails.products.push(productCopy);
          }
        });

        return orderDetails;
      }),
    );
    console.log(ordersWithDetails);
    return ordersWithDetails;
  } catch (err) {}
};

const getUserOrder = async (id, user) => {
  let sql = promisePool.format("SELECT * from orders WHERE orderer = ?", [
    user.id,
  ]);

  if (user.access === "admin") {
    sql = promisePool.format("SELECT * from orders WHERE orderer = ?", [id]);
  }

  const [orders] = await promisePool.execute(sql);

  if (orders.length === 0) {
    return false;
  }

  const ordersWithProducts = await Promise.all(
    orders.map(async (order) => {
      const [products] = await promisePool.query(
        "SELECT p.*, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ?",
        [order.id],
      );

      const orderDetails = {
        order: order,
        products: [],
      };

      products.forEach((product) => {
        for (let i = 0; i < product.quantity; i++) {
          let productCopy = { ...product };
          delete productCopy.quantity;
          orderDetails.products.push(productCopy);
        }
      });

      return orderDetails;
    }),
  );
  return ordersWithProducts;
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

const deliverOrder = async (id, user) => {
  if (user.access !== "admin") {
    return { message: "unauthorized" };
  }
  try {
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    const status = 1;
    const [result] = await promisePool.execute(sql, [status, id]);
    if (result.affectedRows === 0) {
      return { message: "invalid" };
    }
    return { message: "success" };
  } catch (error) {
    return false;
  }
};

export { addOrder, getAllOrders, getUserOrder, delOrder, deliverOrder };
