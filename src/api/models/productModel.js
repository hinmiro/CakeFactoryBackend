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
  const query = `
  SELECT
      p.id AS product_id,
      p.name AS product_name,
      p.price AS product_price,
      p.description AS product_description,
      p.img AS product_img,
      i.id AS ingredient_id,
      i.name AS ingredient_name,
      a.id AS allergen_id,
      a.name AS allergen_name
  FROM
      products p
  JOIN
      ingredients_products ip ON p.id = ip.product_id
  JOIN
      ingredients i ON ip.ingredient_id = i.id
  JOIN
      allergens_ingredients ai ON i.id = ai.ingredient_id
  JOIN
      allergens a ON ai.allergen_id = a.id;
`;
  const rows = await promisePool.query(query);
  if (rows[0].length === 0) {
    return { message: "No products in database" };
  }
  let products = [];

  rows[0].forEach((row) => {
    let product = products.find(
      (product) => product.product_id === row.product_id,
    );

    if (!product) {
      product = {
        product_id: row.product_id,
        product_name: row.product_name,
        product_price: row.product_price,
        product_description: row.product_description,
        product_img: row.product_img,
        ingredients: [],
        allergens: [],
      };

      products.push(product);
    }

    let ingredient = product.ingredients.find(
      (i) => i.ingredient_id === row.ingredient_id,
    );

    if (!ingredient) {
      ingredient = {
        ingredient_id: row.ingredient_id,
        ingredient_name: row.ingredient_name,
      };
      product.ingredients.push(ingredient);
    }

    let allergen = product.allergens.find(
      (a) => a.allergen_id === row.allergen_id,
    );

    if (!allergen) {
      allergen = {
        allergen_id: row.allergen_id,
        allergen_name: row.allergen_name,
      };
      product.allergens.push(allergen);
    }
  });
  return products;
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

const newIngredient = async (body, user) => {
  if (user.access !== "admin") {
    return { message: "unauthorized" };
  }
  const { name, price, allergens } = body;
  const [checkName] = await promisePool.query(
    "SELECT * FROM ingredients WHERE name = ?",
    [name],
  );
  if (checkName === 0) return { message: "exist" };
  const [rows] = await promisePool.execute(
    "INSERT INTO ingredients (name, price) VALUES (?, ?)",
    [name, price],
  );

  if (rows.affectedRows === 0) {
    return false;
  }
  if (allergens.length === 0) {
    return { message: "no allergens" };
  }
  await Promise.all(
    allergens.map(async (i) => {
      const [check] = await promisePool.query(
        "SELECT * FROM allergens WHERE name = ?",
        [i],
      );
      if (check.length > 0) {
        const [add] = await promisePool.execute(
          "INSERT INTO allergens_ingredients (allergen_id, ingredient_id) VALUES (?, ?)",
          [check[0].id, rows.insertId],
        );
        return add;
      } else {
        const [allergen] = await promisePool.execute(
          "INSERT INTO allergens (name) VALUES (?)",
          [i],
        );
        return promisePool.execute(
          "INSERT INTO allergens_ingredients (allergen_id, ingredient_id) VALUES (?, ?)",
          [allergen.insertId, rows.insertId],
        );
      }
    }),
  );
  return { message: "Success" };
};

const delIng = async (id, user) => {
  if (user.access !== "admin") {
    return false;
  }
  await promisePool.execute(
    "DELETE FROM allergens_ingredients WHERE ingredient_id = ?",
    [id],
  );
  const [rows] = await promisePool.execute(
    "DELETE FROM ingredients WHERE id = ?",
    [id],
  );

  if (rows.affectedRows === 0) return { message: "nothing" };
  return true;
};

export {
  addProduct,
  getAllProducts,
  getProduct,
  exterminateProduct,
  updateProduct,
  getAllIngredients,
  getProductIngredients,
  newIngredient,
  delIng,
};
