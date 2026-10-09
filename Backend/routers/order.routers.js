import express from 'express';
const orderRouter = express.Router();
import tokenAuth from '../middlewares/tokenAuth.js'
import {createOrder,verifyPayment,fetchAllOrders,updateOrderStatus} from '../controllars/order.controllars.js'
orderRouter.use(tokenAuth);

orderRouter.post("/create",createOrder);
orderRouter.post("/verify",verifyPayment);
orderRouter.get('/',fetchAllOrders);
orderRouter.post('/change-status',updateOrderStatus);

export default orderRouter;