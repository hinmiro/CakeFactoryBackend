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

const addCode = async (body) => {
  const {name, amount, code} = body;
  const sql = `INSERT INTO discount (name, amount, code) VALUES (?, ?, ?)`;
  const params = [name, amount, code];

  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { message: 'ok'};
}

export { getDiscounts, addCode };
