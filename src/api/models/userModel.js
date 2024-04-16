"use strict";

import promisePool from "../../utils/database.js";
import "dotenv/config";

const listAllUsers = async () => {
  const rows = await promisePool.query("SELECT * FROM users");
  return rows;
};

const addUser = async (user) => {
  const { name, address, username, password, access } = user;
  const params = [name, address, username, password, access];
  if (params.some((p) => p === null || p === undefined)) return false;

  const sql =
    "INSERT INTO user (name, address, username, password, access) VALUES (?, ?, ?, ?, ?)";

  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) return false;
  return { message: "User added to database" };
};

export { listAllUsers, addUser };
