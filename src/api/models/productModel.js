"use strict";

import promisePool from "../../utils/database.js";

const addProduct = async (product, file, user) => {
  const { name, price, description } = product;

  const sql = `INSERT INTO products (name, price, description, img) VALUES (?, ?, ?, ?)`;
  const params = [name, price, description, file.filename].map((value) => {
    if (value === undefined || value === null) {
      return null;
    } else {
      return value;
    }
  });
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return false;
  } else {
    return { message: "Success" };
  }
};

const getAllProducts = async () => {
  const [rows] = await promisePool.execute("SELECT * FROM products");
  if (rows.length === 0) {
    return { message: "No products in database" };
  }
  return rows;
};

const getProduct = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM products WHERE id = ?",
    [id],
  );
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const exterminateProduct = async (id, user) => {
  if (user.access !== "admin") {
    return { message: "Only admin can delete products" };
  }
  try {
    const [rows] = await promisePool.execute(
      "DELETE FROM products WHERE id = ?",
      [id],
    );
    if (rows.affectedRows === 0) return false;
    return { message: "Product deleted" };
  } catch (err) {
    console.error("Error: ", err);
    return false;
  }
};

const updateProduct = async (id, user, body) => {
  if (user.access !== "admin") {
    return { message: "Only admin can update products" };
  }
  console.log(body);
  const sql = promisePool.format("UPDATE products SET ? WHERE id = ?", [
    body,
    id,
  ]);
  const [rows] = await promisePool.execute(sql);
  if (rows.affectedRows === 0) return { message: "Nothing to update" };
  return { message: "Product update success", rows };
};

export {
  addProduct,
  getAllProducts,
  getProduct,
  exterminateProduct,
  updateProduct,
};
