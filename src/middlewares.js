"use strict";

import jwt from "jsonwebtoken";
import "dotenv/config";
import { validationResult } from "express-validator";

const optionalAuthToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return next();
  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) return next();
    res.locals.user = user;
    next();
  });
};

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // console.log("Token: ", token);
  if (token == null) res.sendStatus(401);

  try {
    res.locals.user = jwt.verify(token, process.env.SECRETKEY);
    next();
  } catch (err) {
    res.status(403).send({ message: "Invalid token" });
  }
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  res.status(err || 500);
  res.json({
    error: {
      message: err.message + " I MA CAKE!",
      status: res.status || 500,
    },
  });
};

const validationErrors = async (req, res, next) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(", ");
    const error = new Error(messages);
    error.status = 400;
    next(error);
  }
  next();
};

export {
  authToken,
  notFoundHandler,
  errorHandler,
  validationErrors,
  optionalAuthToken,
};
