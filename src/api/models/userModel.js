"use strict";

import promisePool from "../../utils/database.js";
import "dotenv/config";

const listAllUsers = async () => {
  const rows = await promisePool.query("SELECT * FROM users");
  return rows;
};
