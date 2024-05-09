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
import jwt from "jsonwebtoken";

/**
 * @api {get} /v1/users Get All Users
 * @apiName GetAllUsers
 * @apiGroup User
 *
 * @apiSuccess {Object[]} users List of all users.
 *
 * @apiError InternalServerError Internal server error.
 */
const getAllUsers = async (req, res, next) => {
  try {
    res.json(await listAllUsers());
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /v1/users Register User
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {Object} user User details.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} result User details.
 *
 * @apiError Conflict Username is taken.
 */
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
    const token = jwt.sign({ id: result.id }, process.env.SECRETKEY, {
      expiresIn: "24h",
    });
    res.status(201).json({ message: "New user added:", result, token });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {get} /v1/users/:id Get User By Id
 * @apiName GetUserById
 * @apiGroup User
 *
 * @apiParam {Number} id ID of the user.
 *
 * @apiSuccess {Object} user User details.
 *
 * @apiError BadRequest Invalid user id.
 */
const getUserById = async (req, res, next) => {
  try {
    const result = await getUser(req.params.id);
    if (!result) res.sendStatus(400);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * @api {put} /v1/users/:id Update User
 * @apiName ModifyUser
 * @apiGroup User
 *
 * @apiParam {Number} id ID of the user to update.
 * @apiParam {Object} user Updated user details.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError Unauthorized Only admin can alter users.
 * @apiError BadRequest Invalid user id.
 */
const modifyUser = async (req, res, next) => {
  try {
    const result = await updateUser(req.params.id, req.body, res.locals.user);
    if (!result) res.sendStatus(401);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {delete} /v1/users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id ID of the user to delete.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError Unauthorized Only admin can delete users.
 * @apiError BadRequest Invalid user id.
 */
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
