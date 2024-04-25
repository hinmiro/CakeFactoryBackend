"use strict";
import { getDiscounts } from "../models/discountModel.js";

const getAllDiscounts = async (req, res) => {
  try {
    const result = await getDiscounts(res.locals.user);
    if (result.message === "unauthorized") {
      res.status(403).json({ message: "Only for admins eyeballssSZ!" });
    }
    if (result.message === "noting found") {
      res.status(200).json({ message: "No codes" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error: ", err);
  }
};

export { getAllDiscounts };
