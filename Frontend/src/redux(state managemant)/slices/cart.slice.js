import { createAsyncThunk, createSlice ,isPending, isFulfilled, isRejected} from '@reduxjs/toolkit'
import createApiThunk from '../../../utils/customApiThunk';
const cData = localStorage.getItem('cart')
const initialState = {
  cError:null,
  cSuccess:null,
  cLoading:false,
  cartData:cData ? JSON.parse(cData) : {}
}



export const addTocart = createApiThunk("/api/cart/addToCart",'post','/cart/');
export const getcarts = createApiThunk("/api/cart/fetched",'get','/cart/');


 const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
   
  cleanCartMsg(state){
    state.cError = null;
    state.cSuccess = null;
  }
  },
  extraReducers:(builder)=>{
    builder
    .addCase(addTocart.fulfilled,(state,action)=>{
      const {msg} = action.payload;
      state.cSuccess = msg;
    })

     .addCase(getcarts.fulfilled,(state,action)=>{
      const {msg,cart} = action.payload;
      state.cSuccess = msg;
      state.cartData = cart;
      localStorage.setItem("cart",JSON.stringify(state.cartData))
    })
   
    
       .addMatcher(isPending(addTocart,getcarts), (state) => {
      state.cLoading = true;
      state.cSuccess = null;
      state.cError = null;
    })
    .addMatcher(isFulfilled(addTocart,getcarts), (state) => {
      state.cLoading = false;
    })
    .addMatcher(isRejected(addTocart,getcarts), (state, action) => {
      state.cLoading = false;
      state.cSuccess = null;
      state.cError = action.payload;
    });
    
    
  }
})


export const {cleanCartMsg} = cartSlice.actions

export default cartSlice.reducer