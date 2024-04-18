"use strict";
import bcrypt from "bcrypt";
import { listAllUsers, addUser, getUser } from "../models/userModel.js";

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
  const result = await getUser(req.body);
  if (!result) res.sendStatus(400);
  console.log(result);
  res.status(200).json(result);
};

export { getAllUsers, registerUser, getUserById };
