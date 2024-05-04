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
  try {
    const { name, amount, code } = body;
    const [result] = await promisePool.execute(
      "INSERT INTO discount (name, amount, code) VALUES(?, ?, ?)",
      [name, amount, code],
    );
    if (result.affectedRows === 0) {
      return { message: "Invalid data" };
    } else {
      return { message: "success" };
    }
  } catch (err) {
    return false;
  }
};

const deleteCode = async (user, id) => {
  if (user.access !== "admin") {
    return { message: "unauthorized" };
  }
  try {
    const [result] = await promisePool.execute(
      "DELETE FROM discount WHERE id = ?",
      [id],
    );
    if (result.affectedRows === 0) {
      return { message: "Invalid id" };
    } else {
      return { message: "success" };
    }
  } catch (err) {
    return false;
  }
};

const checkCode = async (body) => {
  const { code } = body;
  try {
    const [result] = await promisePool.query(
      "SELECT * FROM discount WHERE code = ?",
      [code],
    );
    if (result.length === 0) {
      return { message: "invalid" };
    } else {
      return { message: "valid" };
    }
  } catch (err) {
    return err;
  }
};

export { getDiscounts, addDiscount, deleteCode, checkCode };
