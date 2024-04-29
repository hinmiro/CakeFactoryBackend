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
  delIng,
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
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    return res.status(200).json(await getAllProducts());
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const response = await getProduct(req.params.id);
    if (!response) {
      res.sendStatus(204);
    } else {
      res.status(200).json(response);
    }
  } catch (err) {
    next(err);
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

const getIngredients = async (req, res, next) => {
  try {
    const result = await getAllIngredients();
    if (!result) {
      res.sendStatus(500);
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const productIngredients = async (req, res, next) => {
  try {
    const result = await getProductIngredients(req.params.id);
    if (!result) {
      res.status(204).json({ message: "No ingredients with that product" });
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const addIngredient = async (req, res, next) => {
  try {
    const result = await newIngredient(req.body, res.locals.user);
    if (result.message === "unauthorized") {
      res.status(403).json({ message: "Only admins" });
    }
    if (result.message === "exist") {
      res.status(409).json({ message: "Ingredient already exists" });
    } else {
      res.status(201).json({ message: "New ingredient added" });
    }
  } catch (err) {
    next(err);
  }
};

const deleteIngredient = async (req, res, next) => {
  try {
    const result = await delIng(req.params.id, res.locals.user);
    if (!result) {
      res.status(403).json({ message: "Only for admins m8" });
    }
    if (result.message === "nothing") {
      res.status(409).json({ message: "Invalid id" });
    } else {
      res.status(200).json({ message: "Ingredient delete success" });
    }
  } catch (err) {
    next(err);
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
  deleteIngredient,
};
