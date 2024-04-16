"use strict";

import jwt from "jsonwebtoken";
import "dotenv/config";
import { validationResult } from "express-validator";

const authenticateToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(", ")[1];
  console.log("Token: ", token);
  if (token == null) res.sendStatus(401);

  try {
    res.locals.user = jwt.verify(token, process.env.SECRETKEY);
  } catch (err) {
    res.status(403).send({ message: "Invalid token" });
  }
};

export { authenticateToken };
