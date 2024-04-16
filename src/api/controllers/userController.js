"use strict";
import bcrypt from "bcrypt";
import { listAllUsers, addUser } from "../models/userModel.js";

const getAllUsers = async (req, res) => {
  res.json(await listAllUsers());
};

const registerUser = async (req, res) => {
  console.log("Register user");
  req.body.password = bcrypt.hashSync(req.body.password, 12);
  const result = await addUser(req.body);
  if (!result) res.sendStatus(400);
  res.status(201).json({ message: "New user added:", result });
};

export { getAllUsers, registerUser };
