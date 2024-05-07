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

/**
 * @api {post} /v1/products Add Product
 * @apiName PostProduct
 * @apiGroup Product
 *
 * @apiParam {Object} product Product details.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError BadRequest Invalid fields.
 */
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

/**
 * @api {get} /v1/products Get All Products
 * @apiName GetProducts
 * @apiGroup Product
 *
 * @apiSuccess {Object[]} products List of all products.
 *
 * @apiError InternalServerError Internal server error.
 */
const getProducts = async (req, res, next) => {
  try {
    return res.status(200).json(await getAllProducts());
  } catch (err) {
    next(err);
  }
};

/**
 * @api {get} /v1/products/:id Get Product By Id
 * @apiName GetProductById
 * @apiGroup Product
 *
 * @apiParam {Number} id ID of the product.
 *
 * @apiSuccess {Object} product Product details.
 *
 * @apiError NoContent No product found with the provided id.
 */
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

/**
 * @api {delete} /v1/products/:id Delete Product
 * @apiName DeleteProduct
 * @apiGroup Product
 *
 * @apiParam {Number} id ID of the product to delete.
 *
 * @apiSuccess {Object} result Success message.
 *
 * @apiError BadRequest No product with that id.
 */
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

/**
 * @api {put} /v1/products/:id Update Product
 * @apiName PutProduct
 * @apiGroup Product
 *
 * @apiParam {Number} id ID of the product to update.
 * @apiParam {Object} product Updated product details.
 *
 * @apiSuccess {Object} result Updated product details.
 *
 * @apiError BadRequest No product with that id.
 */
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

/**
 * @api {get} /v1/products/ingredients Get All Ingredients
 * @apiName GetIngredients
 * @apiGroup Product
 *
 * @apiSuccess {Object[]} ingredients List of all ingredients.
 *
 * @apiError InternalServerError Internal server error.
 */
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
/**
 * @api {get} /v1/products/:id/ingredients Get Product Ingredients
 * @apiName ProductIngredients
 * @apiGroup Product
 *
 * @apiParam {Number} id ID of the product.
 *
 * @apiSuccess {Object[]} ingredients List of product's ingredients.
 *
 * @apiError NoContent No ingredients with that product.
 */
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
/**
 * @api {post} /v1/products/ingredients Add Ingredient
 * @apiName AddIngredient
 * @apiGroup Product
 *
 * @apiParam {Object} ingredient Ingredient details.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError Conflict Ingredient already exists.
 * @apiError Unauthorized Only admins.
 */
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
/**
 * @api {delete} /v1/products/ingredients/:id Delete Ingredient
 * @apiName DeleteIngredient
 * @apiGroup Product
 *
 * @apiParam {Number} id ID of the ingredient to delete.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError Conflict Invalid id.
 * @apiError Unauthorized Only for admins.
 */
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
