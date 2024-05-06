"use strict";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { getUserByUsername } from "../models/userModel.js";

const postLogin = async (req, res) => {
  const user = await getUserByUsername(req.body.username);
  if (!user) return res.status(401).json({ message: "Invalid username" });

  if (!bcrypt.compareSync(req.body.password, user.password))
   return res.status(401).json({ message: "Invalid password" });

  delete user.password;

  const token = jwt.sign(user, process.env.SECRETKEY, {
    expiresIn: "24h",
  });
  res.json({ user: user, token });
};

const getMe = async (req, res) => {
  if (res.locals.user) {
    res.json({ message: "Token is valid", user: res.locals.user });
  } else {
    res.sendStatus(401);
  }
};

export { postLogin, getMe };
