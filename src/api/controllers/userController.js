"use strict";
import bcrypt from "bcrypt";
import {
  listAllUsers,
  addUser,
  getUser,
  updateUser,
  deleteUserById,
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
  // console.log(result);
  res.status(200).json(result);
};

const modifyUser = async (req, res) => {
  const result = await updateUser(req.params.id, req.body, res.locals.user);
  if (!result) res.sendStatus(401);
  res.status(200).json({ message: "User updated successfully" });
};

const deleteUser = async (req, res) => {
  const result = await deleteUserById(req.params.id, res.locals.user);
  if (!result) res.status(401).json({ message: "Only admin can delete other users"});
  else res.status(200).json({ message: "User deleted" });
};

export { getAllUsers, registerUser, getUserById, modifyUser, deleteUser };
