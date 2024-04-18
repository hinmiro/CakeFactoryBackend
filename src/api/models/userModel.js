"use strict";

import promisePool from "../../utils/database.js";
import "dotenv/config";

const listAllUsers = async () => {
  const rows = await promisePool.query("SELECT * FROM users");
  return rows;
};

const addUser = async (user) => {
  const {
    name,
    street_name,
    street_num,
    zip_code,
    city,
    username,
    password,
    access,
  } = user;
  const params = [
    name,
    street_name,
    street_num,
    zip_code,
    city,
    username,
    password,
    access,
  ];
  if (params.some((p) => p === null || p === undefined)) return false;

  const sql =
    "INSERT INTO users (name, street_name, street_num, zip_code, city, username, password, access) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) return false;
  return { message: "User added to database" };
};

const getUser = async (user) => {
  const rows = await promisePool.query(
    "SELECT * FROM users WHERE user_id = ?",
    [user.user_id],
  );
  if (rows[0].length === 0) return false;
  return rows[0];
};

export { listAllUsers, addUser, getUser };
