import { createAsyncThunk, createSlice ,isPending, isFulfilled, isRejected} from '@reduxjs/toolkit'
import createApiThunk from '../../../utils/customApiThunk';
const oData = localStorage.getItem('order');
const order = localStorage.getItem('orders');
const initialState = {
  oError:null,
  oSuccess:null,
  oLoading:false,
  orderData:oData ? JSON.parse(oData) : {},
  orders:order ? JSON.parse(order):[]
}



export const orderCreate = createApiThunk("/api/order/create",'post','/order/create');
export const orderVerify = createApiThunk("/api/order/verify",'post','/order/verify');
export const fetchOrders = createApiThunk('/api/order/fetch','get','/order/');
export const updateOrderStatus = createApiThunk('/api/order/update','post','/order/change-status');

const allThunks = [orderCreate,orderVerify,fetchOrders,updateOrderStatus]

 const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
   
  cleanOrderMsg(state){
    state.oError = null;
    state.oSuccess = null;
  }
  },
  extraReducers:(builder)=>{
    builder
    .addCase(orderCreate.fulfilled,(state,action)=>{
      const {msg,data} = action.payload;
      state.oSuccess = msg;
      state.orderData = data;
      localStorage.setItem('order', JSON.stringify(state.orderData))
    })

     .addCase(orderVerify.fulfilled,(state,action)=>{
      const {msg,cart} = action.payload;
      state.oSuccess = msg;
      
    })
    .addCase(fetchOrders.fulfilled,(state,action)=>{
      const {msg,orders} = action.payload;
      state.oSuccess = msg;
      state.orders = orders;
      localStorage.setItem('orders', JSON.stringify(state.orders));
    })

     .addCase(updateOrderStatus.fulfilled,(state,action)=>{
      const {msg} = action.payload;
      state.oSuccess = msg;
    })
    
       .addMatcher(isPending(...allThunks), (state) => {
      state.oLoading = true;
      state.oSuccess = null;
      state.oError = null;
    })
    .addMatcher(isFulfilled(...allThunks), (state) => {
      state.oLoading = false;
    })
    .addMatcher(isRejected(...allThunks), (state, action) => {
      state.oLoading = false;
      state.oSuccess = null;
      state.oError = action.payload;
    });
    
    
  }
})


export const {cleanOrderMsg} = orderSlice.actions

export default orderSlice.reducer