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
  req.body.access = "user";
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
  switch (result.message) {
    case "undelivered orders":
      res.status(400).json({
        message:
          "User has undelivered orders, try delete again after orders has delivered.",
      });
      break;

    case "admin delete":
      res.status(400).json({ message: "Admin cant delete itself" });
      break;

    case "unauthorized delete":
      res.status(401).json({ message: "Only admin can delete other users" });
      break;

    case "success":
      res.status(200).json({ message: "User deleted" });
      break;
  }
};

export { getAllUsers, registerUser, getUserById, modifyUser, deleteUser };
