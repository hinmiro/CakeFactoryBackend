import express from "express";
import "dotenv";
import orderRouter from './routes/orderRouter.js';
import productRouter from './routes/productRouter.js';

const router = express.Router();

router.use('/order', orderRouter);
router.use('/product', productRouter);


export default router;
