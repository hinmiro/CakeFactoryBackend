import express from "express";
import api from "./api/index.js";
import cors from "cors";
import authRouter from "./api/routes/authRouter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", api);
app.use("/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("**Cake Factory server**");
});

export default app;
