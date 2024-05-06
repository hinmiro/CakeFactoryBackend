"use strict";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { getUserByUsername } from "../models/userModel.js";

/**
 * @api {post} /login User Login
 * @apiName PostLogin
 * @apiGroup User
 *
 * @apiParam {String} username User's unique username.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {Object} user User's information.
 * @apiSuccess {String} token JWT token for the user.
 *
 * @apiError Unauthorized The username or password is incorrect.
 */

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

/**
 * @api {get} /me Get Current User
 * @apiName GetMe
 * @apiGroup User
 *
 * @apiHeader {String} Authorization JWT token of the user.
 *
 * @apiSuccess {Object} user User's information.
 *
 * @apiError Unauthorized Invalid or no token provided.
 */

const getMe = async (req, res) => {
  if (res.locals.user) {
    res.json({ message: "Token is valid", user: res.locals.user });
  } else {
    res.sendStatus(401);
  }
};

export { postLogin, getMe };
