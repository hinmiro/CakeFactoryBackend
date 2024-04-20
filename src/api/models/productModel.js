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

// Todo : Update product write function
// Todo : Delete product read function
// Todo : Get product by id read function

export { addProduct, getAllProducts };
