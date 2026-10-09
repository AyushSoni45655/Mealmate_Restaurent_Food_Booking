import { createSlice,isPending, isFulfilled, isRejected } from '@reduxjs/toolkit'
import createApiThunk from '../../../utils/customApiThunk';
const product = localStorage.getItem('product');
const aProduct = localStorage.getItem('aProduct');
const pagination = localStorage.getItem('pagination');
const initialState = {
  page:1,
  limit:10,
  category:"",
  subCategoryy:"",
  pError:null,
  pLoading:false,
  pSuccess:null,
  pData:product ? JSON.parse(product):[],
  allProduct:aProduct ? JSON.parse(aProduct):[],
  pagination:pagination ? JSON.parse(pagination):{}
}


export const addProduct = createApiThunk("/api/product/add",'post','/food/add-food');
export const updateStatus = createApiThunk("/api/product/update-status",'post','/food/update-status');
export const getAllProducts = createApiThunk("/api/product",'get','/food',(data)=>{const {page,limit,category,subCategory} = data; return {page,limit,category,subCategory}})


    const apiThunk = [addProduct,getAllProducts,updateStatus]
 const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setPage(state,action){
      state.page = action.payload;
    },
    setCategory(state,action){
      state.category = action.payload;
    },
    setSubCategory(state,action){
      state.subCategoryy = action.payload;
    },
  cleanProductMsg(state){
    state.pError = null;
    state.pSuccess = null;
  }
  },
  extraReducers:(builder)=>{
    builder
    .addCase(addProduct.fulfilled,(state,action)=>{
      const {msg,data} = action.payload;
      state.pSuccess = msg;
      state.pData = [...state.pData,data];
      localStorage.setItem('product', JSON.stringify(state.pData))
    })

     .addCase(updateStatus.fulfilled,(state,action)=>{
      const {msg,product} = action.payload;
      state.pSuccess = msg;
      state.allProduct = state.allProduct.filter((item)=>item._id !== product._id);
      state.allProduct = [...state.allProduct,product]
      localStorage.setItem('aProduct', JSON.stringify(state.allProduct))
    })

    .addCase(getAllProducts.fulfilled,(state,action)=>{
      state.allProduct = []
      localStorage.removeItem('aProduct')
      const {msg,products,pagination} = action.payload;
      state.pSuccess = msg;
      state.allProduct = products;
      state.pagination = pagination;
      localStorage.setItem('aProduct', JSON.stringify(products));
      localStorage.setItem('pagination', JSON.stringify(pagination));
    })
    
    .addMatcher(isPending(...apiThunk), (state)=>{
      state.pLoading = true;
      state.pSuccess = null;
      state.pError = null;
    })
     .addMatcher(isFulfilled(...apiThunk), (state)=>{
      state.pLoading = false;
    })
    .addMatcher(isRejected(...apiThunk), (state,action)=>{
      state.pLoading = false;
      state.pSuccess = null;
      state.pError = action.payload;
    })
    
    
  }
})


export const {cleanProductMsg,setPage,setCategory,setSubCategory} = productSlice.actions

export default productSlice.reducer