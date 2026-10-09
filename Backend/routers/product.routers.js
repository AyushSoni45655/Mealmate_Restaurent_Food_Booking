import {
 addProduct,getAllProduct,updateProductStatus
} from "../controllars/product.controllar.js"
import express from 'express';
import upload from "../middlewares/multer.js";
import tokenAuth from "../middlewares/tokenAuth.js";
const productRouter = express.Router();


productRouter.post("/add-food",tokenAuth,upload.single('image'),addProduct);
productRouter.get("/",tokenAuth,getAllProduct);
productRouter.post('/update-status',tokenAuth,updateProductStatus);

export default productRouter;