"use strict";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { getUserByUsername } from "../models/userModel.js";

const postLogin = async (req, res) => {
  const user = await getUserByUsername(req.body.username);
  if (!user) res.sendStatus(401);

  if (!bcrypt.compareSync(req.body.password, user.password))
    res.sendStatus(401);

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
