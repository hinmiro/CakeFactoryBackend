"use strict";

import {
  addProduct,
  getAllProducts,
  getProduct,
  exterminateProduct,
  updateProduct,
  getAllIngredients,
  getProductIngredients,
  newIngredient,
} from "../models/productModel.js";

const postProduct = async (req, res, next) => {
  try {
    const result = await addProduct(req.body, req.file, res.locals.user);
    if (!result) {
      const error = new Error("Invalid fields");
      error.status = 400;
      next(error);
    } else {
      res.status(201).json({ message: "New product added" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  return res.status(200).json(await getAllProducts());
};

const getProductById = async (req, res) => {
  const response = await getProduct(req.params.id);
  if (!response) {
    res.sendStatus(204);
  } else {
    res.status(200).json(response);
  }
};

const deleteProduct = async (req, res, next) => {
  const result = await exterminateProduct(req.params.id, res.locals.user);
  if (!result) {
    const error = new Error("No product with that id");
    error.status = 400;
    next(error);
  } else {
    res.status(200).json(result);
  }
};

const putProduct = async (req, res, next) => {
  const result = await updateProduct(req.params.id, res.locals.user, req.body);
  if (!result) {
    const error = new Error("No product with that id");
    error.status = 400;
    next(error);
  } else {
    res.status(200).json(result);
  }
};

const getIngredients = async (req, res) => {
  const result = await getAllIngredients();
  if (!result) {
    res.sendStatus(500);
  }
  res.status(200).json(result);
};

const productIngredients = async (req, res) => {
  const result = await getProductIngredients(req.params.id);
  if (!result) {
    res.status(204).json({ message: "No ingredients with that product" });
  }
  res.status(200).json(result);
};

const addIngredient = async (req, res) => {
  try {
    const result = await newIngredient(req.body, res.locals.user);
    if (result.message === "unauthorized")
      res.status(403).json({ message: "Only admins" });

    if (!result) {
      res.status(403).json({ message: "Invalid fields" });
    }

    res.status(201).json({ message: "New ingredient added" });
  } catch (err) {
    console.error("Error: ", err);
  }
};

export {
  postProduct,
  getProducts,
  getProductById,
  deleteProduct,
  putProduct,
  getIngredients,
  productIngredients,
  addIngredient,
};
