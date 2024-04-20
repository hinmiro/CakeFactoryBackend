"use strict";

import promisePool from "../../utils/database.js";
import "dotenv/config";

const listAllUsers = async () => {
  const [rows] = await promisePool.query("SELECT * FROM users");
  return rows;
};
//todo if access not given then it should be user
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

const updateUser = async (id, body, user) => {
  if (user.access !== "admin" && body.access) {
    return { message: "Only admins are allowed to change user access." };
  }

  let sql = promisePool.format("UPDATE users SET ? WHERE id = ?", [
    body,
    user.id,
  ]);

  if (user.access === "admin") {
    sql = promisePool.format("UPDATE users SET ? WHERE id = ?", [body, id]);
  }

  try {
    const rows = await promisePool.execute(sql);
    console.log("Updated user", rows);
    if (rows[0].affectedRows === 0) return false;
    return { message: "Success" };
  } catch (err) {
    console.error("Error", err);
    return false;
  }
};
// todo fix deleteUser it doesnt delete right id, it deletes user itself
const deleteUserById = async (id, user) => {
  if (id !== user.id && user.access !== "admin") {
    return;
  }
  console.log("id", id, "   user", user.id);
  let sql = promisePool.format("DELETE FROM users WHERE id = ?", [user.id]);

  if (user.access === "admin") {
    let sql = promisePool.format("DELETE FROM users WHERE id = ?", [id]);
  }
  try {
    const rows = await promisePool.execute(sql);
    if (rows[0].length === 0) return false;
    return { message: "Deleted user" };
  } catch (err) {
    console.error("Error", err);
    return false;
  }
};

export {
  getUserByUsername,
  listAllUsers,
  addUser,
  getUser,
  updateUser,
  deleteUserById,
};
