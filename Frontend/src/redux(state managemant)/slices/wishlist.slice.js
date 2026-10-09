import {  createSlice ,isPending, isFulfilled, isRejected} from '@reduxjs/toolkit'

import createApiThunk from '../../../utils/customApiThunk.js';
const isWishList = localStorage.getItem('wishlist');
const isWishListIds = localStorage.getItem('wishlistId');
const isFaivrates = localStorage.getItem('faivrate');
const initialState = {
  faivratesItem:isFaivrates ? JSON.parse(isFaivrates):[],
  wishListIds:isWishListIds ? JSON.parse(isWishListIds):[],
  wLoading:false,
  wSuccess:null,
  wError:null,
  wishlists:isWishList ? JSON.parse(isWishList):[]
}



export const toggleWishList = createApiThunk("/api/wishlist/toggle",'post',(data)=>`/wishlist/${data.productId}/toggle`)
  
export const getWishListIds = createApiThunk("/api/wishlist/getIds",'get','/wishlist');
export const getFaivrates = createApiThunk("/api/wishlist/faivrates",'get','/wishlist/faivrates');

 const wishListSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
   
  cleanWishlistMsg(state){
    state.wError = null;
    state.wSuccess = null;
  }
  },
  extraReducers:(builder)=>{
    builder
    .addCase(toggleWishList.fulfilled,(state,action)=>{
      const {msg,ids} = action.payload;
      state.wSuccess = msg;
      state.wishListIds = ids;
      localStorage.setItem('wishlistId', JSON.stringify(state.wishListIds))
    })
    .addCase(getWishListIds.fulfilled,(state,action)=>{
      const {msg,ids} = action.payload;
      state.wSuccess = msg;
      state.wishListIds = ids;
      localStorage.setItem('wishlistId', JSON.stringify(ids))
    })
    .addCase(getFaivrates.fulfilled,(state,action)=>{
      const {msg,data} = action.payload;
      state.wSuccess = msg;
      state.faivratesItem = data;
      localStorage.setItem('faivrate', JSON.stringify(state.faivratesItem))
    })
    
       .addMatcher(isPending(toggleWishList, getWishListIds,getFaivrates), (state) => {
      state.wLoading = true;
      state.wSuccess = null;
      state.wError = null;
    })
    .addMatcher(isFulfilled(toggleWishList, getWishListIds,getFaivrates), (state) => {
      state.wLoading = false;
    })
    .addMatcher(isRejected(toggleWishList, getWishListIds,getFaivrates), (state, action) => {
      state.wLoading = false;
      state.wSuccess = null;
      state.wError = action.payload;
    });
    
    
  }
})


export const {cleanWishlistMsg} = wishListSlice.actions

export default wishListSlice.reducer