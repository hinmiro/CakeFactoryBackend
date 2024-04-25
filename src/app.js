import express from "express";
import api from "./api/index.js";
import cors from "cors";
import authRouter from "./api/routes/authRouter.js";
import {
  errorHandler,
  notFoundHandler,
  validationErrors,
} from "./middlewares.js";
import orderRouter from "./api/routes/orderRouter.js";
import productRouter from "./api/routes/productRouter.js";
import discountRouter from "./api/routes/discountRouter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/v1", api);
app.use("/v1/auth", authRouter);
app.use("/v1/orders", orderRouter);
app.use("/v1/products", productRouter);
app.use("/v1/discounts", discountRouter);
app.use(notFoundHandler);
app.use(errorHandler);
app.use(validationErrors);

app.get("/", (req, res) => {
  res.send("**Cake Factory server**");
});

export default app;
