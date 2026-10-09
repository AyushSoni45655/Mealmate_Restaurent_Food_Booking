import express from 'express';
import {addToCart,getCartItem} from '../controllars/cart.controllar.js'
import tokenAuth from '../middlewares/tokenAuth.js'
const cartRouter = express.Router();

cartRouter.use(tokenAuth);

cartRouter.post("/",addToCart);
cartRouter.get("/",getCartItem)
export default cartRouter;