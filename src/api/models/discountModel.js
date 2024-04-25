"use strict";

import promisePool from "../../utils/database.js";

const getDiscounts = async (user) => {
  if (user.access !== "admin") {
    return { message: "unauthorized" };
  }
  const [result] = await promisePool.query("SELECT * FROM discount");
  if (result.length === 0) {
    return { message: "noting found" };
  }
  return result;
};

const addDiscount = async (user, body) => {
  if (user.access !== "admin") {
    return { message: "unauthorized" };
  }
  const { name, amount } = body;
  const randomBytes = crypto.randomBytes(Math.ceil(10 / 2));
  const code = randomBytes.toString("hex").slice(0, 10);
  try {
    const [result] = await promisePool.execute(
      "INSERT INTO discounts (name, amount, code) VALUES(?, ?, ?)",
      [name, amount, code],
    );
    if (result.affectedRows === 0) {
      return { message: "Invalid data" };
    } else {
      return { message: "success" };
    }
  } catch (err) {
    console.error("Error: ", err);
    return false;
  }
};

const deleteCode = async (user, id) => {
  if (user.access !== "admin") {
    return { message: "unauthorized" };
  }
  try {
    const [result] = await promisePool.execute(
      "DELETE FROM discounts WHERE id = ?",
      [id],
    );
    if (result.affectedRows === 0) {
      return { message: "Invalid id" };
    } else {
      return { message: "success" };
    }
  } catch (err) {
    console.error("Error: ", err);
    return false;
  }
};

export { getDiscounts, addDiscount, deleteCode };
