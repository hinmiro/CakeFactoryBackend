"use strict";

import promisePool from "../../utils/database.js";

const getDiscounts = async (user) => {
  if (user.access !== "admin") {
    return { message: "unauthorized" };
  }
  const [result] = await promisePool.query("SELECT * FROM discount");
  if (result.length === 0) {
    return { message: "noting found" };
  }
  return result;
};

export { getDiscounts };
