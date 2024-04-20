"use strict";
import express from "express";
import crypto from "crypto";
import multer from "multer";
import {
  postProduct,
  getProducts,
  getProductById,
  deleteProduct,
  putProduct,
} from "../controllers/productController.js";
import { authToken, validationErrors } from "../../middlewares.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const suffix = crypto.randomBytes(16).toString("hex");
    const prefix = file.fieldname.split(".").pop();
    let extension = "jpg";
    if (file.mimetype === "image/png") {
      extension = "png";
    }
    if (file.mimetype === "image/jpeg") {
      extension = "jpeg";
    }
    const filename = `${prefix}${suffix}.${extension}`;
    cb(null, filename);
  },
});

const upload = multer({
  destination: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 2024,
  },
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      const error = new Error("Only images are allowed");
      error.status = 400;
      cb(error);
    }
  },
});

const adminUpload = (req, res, next) => {
  if (res.locals.user.access !== "admin") {
    return res
      .status(401)
      .json({ message: "Only admins are allowed to add products" });
  }
  upload.single("img")(req, res, next);
};

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getProducts)
  .post(authToken, validationErrors, adminUpload, postProduct);

productRouter
  .route("/:id")
  .get(getProductById)
  .delete(authToken, validationErrors, deleteProduct)
  .put(authToken, validationErrors, putProduct);

export default productRouter;
