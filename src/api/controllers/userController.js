"use strict";
import bcrypt from "bcrypt";
import {
  listAllUsers,
  addUser,
  getUser,
  updateUser,
} from "../models/userModel.js";

const getAllUsers = async (req, res) => {
  res.json(await listAllUsers());
};

const registerUser = async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 12);
  const result = await addUser(req.body);
  if (!result) res.sendStatus(400);
  res.status(201).json({ message: "New user added:", result });
};

const getUserById = async (req, res) => {
  const result = await getUser(req.params.id);
  if (!result) res.sendStatus(400);
  console.log(result);
  res.status(200).json(result);
};

const modifyUser = async (req, res) => {
  const result = await updateUser(req.params.id, req.body);
  if (!result) res.sendStatus(401);
  res.status(200).json({ message: "User updated successfully" });
};

export { getAllUsers, registerUser, getUserById, modifyUser };
