"use strict";

import promisePool from "../../utils/database.js";
import "dotenv/config";

const listAllUsers = async () => {
  const rows = await promisePool.query("SELECT * FROM users");
  return rows;
};

const addUser = async (user) => {
  const { name, street_name, street_num, zip_code, city, username, password } =
    user;
  const params = [
    name,
    street_name,
    street_num,
    zip_code,
    city,
    username,
    password,
  ];
  if (params.some((p) => p === null || p === undefined)) return false;

  const sql =
    "INSERT INTO users (name, street_name, street_num, zip_code, city, username, password, access) VALUES (?, ?, ?, ?, ?, ?, ?, 'user')";

  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) return false;
  return { message: "User added to database" };
};

const getUser = async (id) => {
  console.log(id);
  const rows = await promisePool.query("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  if (rows[0].length === 0) return false;
  return rows[0];
};

const getUserByUsername = async (user) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  const [rows] = await promisePool.execute(sql, [user]);
  if (rows.length === 0) return false;
  return rows[0];
};

const updateUser = async (id, user) => {};

export { getUserByUsername, listAllUsers, addUser, getUser, updateUser };
