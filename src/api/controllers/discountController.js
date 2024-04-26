"use strict";
import { getDiscounts, addCode } from "../models/discountModel.js";

const getAllDiscounts = async (req, res) => {
  try {
    const result = await getDiscounts(res.locals.user);
    if (result.message === "unauthorized") {
      res.status(403).json({ message: "Only for admins eyeballssSZ!" });
    }
    if (result.message === "noting found") {
      res.status(200).json({ message: "No codes" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("Error: ", err);
  }
};

const addNewCode = async (req, res, next) => {
  try {
    const result = await addCode(req.body, res.locals.user);
    if (!result) {
      const error = new Error('failed to add code');
      error.status = 400;
      next(error);
    } else {
      res.status(201).json({message: 'New code added'});
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

export { getAllDiscounts, addNewCode };
