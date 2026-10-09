import epress from 'express';
import {toggleWishlist,getWishListIds,getFaivrateItems} from '../controllars/wishlist.controllars.js'
import tokenAuth from '../middlewares/tokenAuth.js';
const wishlistRouter = epress.Router();

wishlistRouter.use(tokenAuth);

wishlistRouter.post(`/:productId/toggle`,toggleWishlist);
wishlistRouter.get(`/`,getWishListIds);
wishlistRouter.get(`/faivrates`,getFaivrateItems);
export default wishlistRouter;