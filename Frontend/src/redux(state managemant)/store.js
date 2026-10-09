import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './slices/user.slice.js'
import ProductSlice from './slices/product.slice.js'
import WishlistSlice from './slices/wishlist.slice.js'
import CartSlice from './slices/cart.slice.js'
import OrderSlice from './slices/order.slice.js'
export const store = configureStore({
  reducer: {
    user:UserSlice,
    product:ProductSlice,
    wishlist:WishlistSlice,
    cart:CartSlice,
    order:OrderSlice
  },
})