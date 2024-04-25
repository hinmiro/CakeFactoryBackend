"use strict";
import {
  getDiscounts,
  addDiscount,
  deleteCode,
} from "../models/discountModel.js";

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

const postDiscount = async (req, res) => {
  const response = await addDiscount(res.locals.user, req.body);
  if (response.message === "unauthorized") {
    res.status(403).json({ message: "Only admin can add discount codes" });
  }
  if (response.message === "Invalid data") {
    res.status(400).json({ message: "Invalid fields" });
  }
  if (response.message === "success") {
    res.status(201).json({ message: "Discount added" });
  } else {
    res.status(500).json({ message: "Database error" });
  }
};

const deleteDiscount = async (req, res) => {
  const response = await deleteCode(res.locals.user, req.params.id);
  if (response.message === "unauthorized") {
    res.status(403).json({ message: "Only admin can delete discounts" });
  }
  if (response.message === "Invalid id") {
    res.status(409).json({ message: "Invalid id" });
  }
  if (response.message === "success") {
    res.status(200).json({ message: "Discount deleted" });
  } else {
    res.status(500).json({ message: "Server error" });
  }
};

// TODO discount checker

export { getAllDiscounts, postDiscount, deleteDiscount };
