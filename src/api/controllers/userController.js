"use strict";
import bcrypt from "bcrypt";
import {
  listAllUsers,
  addUser,
  getUser,
  updateUser,
  deleteUserById,
  isUsernameAvailable,
} from "../models/userModel.js";

const getAllUsers = async (req, res, next) => {
  try {
    res.json(await listAllUsers());
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  const check = await isUsernameAvailable(req.body.username);
  if (!check) {
    res.status(409).json({ message: "Username is taken" });
  }
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 12);
    req.body.access = "user";
    const result = await addUser(req.body);
    if (!result) res.sendStatus(400);
    res.status(201).json({ message: "New user added:", result });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const result = await getUser(req.params.id);
    if (!result) res.sendStatus(400);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const modifyUser = async (req, res, next) => {
  try {
    const result = await updateUser(req.params.id, req.body, res.locals.user);
    if (!result) res.sendStatus(401);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

export { getAllUsers, registerUser, getUserById, modifyUser, deleteUser };
