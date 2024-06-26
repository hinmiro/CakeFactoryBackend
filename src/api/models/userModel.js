"use strict";

import promisePool from "../../utils/database.js";
import crypto from "crypto";
import "dotenv/config";
import bcrypt from "bcrypt";

const listAllUsers = async () => {
  const [rows] = await promisePool.query("SELECT * FROM users");
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
    username || `guest${Math.floor(Math.random() * 1000)}${Date.now()}`,
    password ||
      `${bcrypt.hashSync(crypto.randomBytes(10).toString("hex"), 12)}`,
    access || "guest",
  ];
  if (params.some((p) => p === null || p === undefined)) return false;
  const sql =
    "INSERT INTO users (name, street_name, street_num, zip_code, city, username, password, access) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) return false;
  const newUser = await getUser(rows[0].insertId);
  delete newUser[0].password;
  return newUser;
};

const getUser = async (id) => {
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

  const rows = await promisePool.execute(sql);
  if (rows[0].affectedRows === 0) return false;
  return { message: "Success" };
};

const deleteUserById = async (id, user) => {
  id = parseInt(id);

  if (id !== user.id && user.access !== "admin") {
    return { message: "unauthorized delete" };
  }

  if (id === user.id && user.access === "admin") {
    return { message: "admin delete" };
  }

  if (user.access !== "admin") {
    const [check] = await promisePool.query(
      "SELECT * FROM orders WHERE orderer = ? AND status = 0",
      [id],
    );
    if (check.length > 0) {
      return { message: "undelivered orders" };
    }
  }

  await promisePool.execute("DELETE FROM users WHERE id = ?", [id]);
  return { message: "success" };
};

const createGuestUser = async (body) => {
  const result = await addUser(body);
  if (!result) {
    return false;
  } else {
    return await getUserByUsername(result);
  }
};

const isUsernameAvailable = async (username) => {
  const [response] = await promisePool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
  );
  return response.length === 0;
};

export {
  getUserByUsername,
  listAllUsers,
  addUser,
  getUser,
  updateUser,
  deleteUserById,
  createGuestUser,
  isUsernameAvailable,
};
