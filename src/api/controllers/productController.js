"use strict";

import { addProduct, getAllProducts } from "../models/productModel.js";

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

//Todo: connect deleteProduct function
//Todo: connect updateProduct function

export { postProduct, getProducts };
