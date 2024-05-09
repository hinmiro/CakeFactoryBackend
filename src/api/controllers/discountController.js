"use strict";
import {
  getDiscounts,
  addDiscount,
  deleteCode,
  checkCode,
} from "../models/discountModel.js";

/**
 * @api {get} /v1/discounts Get All Discounts
 * @apiName GetAllDiscounts
 * @apiGroup Discount
 *
 * @apiHeader {String} Authorization JWT token of the user.
 *
 * @apiSuccess {Object[]} discounts List of all discounts.
 *
 * @apiError Unauthorized Only admin can access.
 * @apiError NotFound No discounts found.
 */

const getAllDiscounts = async (req, res) => {
  try {
    const result = await getDiscounts(res.locals.user);
    if (result.message === "unauthorized") {
      res.status(403).json({ message: "Only for admins eyeballzz!" });
    }
    if (result.message === "noting found") {
      res.status(200).json({ message: "No codes" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * @api {post} /v1/discounts Add Discount
 * @apiName PostDiscount
 * @apiGroup Discount
 *
 * @apiHeader {String} Authorization JWT token of the user.
 * @apiParam {String} name Name of the discount.
 * @apiParam {Number} amount Amount of the discount.
 * @apiParam {String} code Code of the discount.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError Unauthorized Only admin can add discount codes.
 * @apiError BadRequest Invalid fields.
 */

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

/**
 * @api {delete} /v1/discounts/:id Delete Discount
 * @apiName DeleteDiscount
 * @apiGroup Discount
 *
 * @apiHeader {String} Authorization JWT token of the user.
 * @apiParam {Number} id ID of the discount to delete.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError Unauthorized Only admin can delete discounts.
 * @apiError Conflict Invalid id.
 */

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

/**
 * @api {post} /v1/discounts/check Check Discount
 * @apiName CheckDiscount
 * @apiGroup Discount
 *
 * @apiParam {String} code Code of the discount to check.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} result Discount details.
 *
 * @apiError Conflict Invalid discount code.
 */

const checkDiscount = async (req, res) => {
  const response = await checkCode(req.body);
  if (response.message === "invalid") {
    res.status(409).json({ message: "Invalid discount code" });
  } else if (response.message === "valid") {
    res.status(200).json({ response });
  } else {
    res.status(500).json(response);
  }
};

export { getAllDiscounts, postDiscount, deleteDiscount, checkDiscount };
