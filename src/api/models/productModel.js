"use strict";

import promisePool from "../../utils/database.js";

const addProduct = async (body, file, user) => {
  const { name, price, description, ingredients } = body;
  const ingredientsList = JSON.parse(ingredients);

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
    await Promise.all(
      ingredientsList.map(async (i) => {
        return promisePool.execute(
          "INSERT INTO ingredients_products (ingredient_id, product_id) VALUES (?, ?)",
          [i, rows[0].insertId],
        );
      }),
    );
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
    const [row1] = await promisePool.execute(
      "DELETE FROM ingredients_products WHERE product_id = ?",
      [id],
    );
    if (row1.affectedRows === 0) return false;

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

const getAllIngredients = async () => {
  const [rows] = await promisePool.execute("SELECT * FROM ingredients");
  if (rows.length === 0) {
    return false;
  }
  return rows;
};

const getProductIngredients = async (id) => {
  const [rows] = await promisePool.query(
    "SELECT p.id, p.name, i.id, i.name FROM products p JOIN ingredients_products ip ON p.id = ip.product_id JOIN ingredients i ON ip.ingredient_id = i.id WHERE p.id = ?;",
    [id],
  );
  console.log(rows);
  if (rows.affectedRows === 0) return false;
  return rows;
};

export {
  addProduct,
  getAllProducts,
  getProduct,
  exterminateProduct,
  updateProduct,
  getAllIngredients,
  getProductIngredients,
};
