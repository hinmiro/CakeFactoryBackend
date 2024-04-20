"use strict";

import {
  addProduct,
  getAllProducts,
  getProduct,
  exterminateProduct,
} from "../models/productModel.js";

const postProduct = async (req, res, next) => {
  try {
    const result = await addProduct(req.body, req.file, res.locals.user);
    if (!result) {
      const error = new Error("Invalid fields");
      error.status = 400;
      next(error);
    } else {
      res.status(201).json({ message: "New product added", result });
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

//Todo: connect updateProduct function

export { postProduct, getProducts, getProductById, deleteProduct };
