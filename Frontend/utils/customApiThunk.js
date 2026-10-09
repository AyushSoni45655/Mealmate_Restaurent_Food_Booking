import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../src/redux(state managemant)/api.js";
 
 
 const createApiThunk = (type, method, urlFn, dataFn) =>
  createAsyncThunk(type, async (data, { rejectWithValue }) => {
    try {
      // URL fixed hai ya dynamic (function se banegi)
      const url = typeof urlFn === "function" ? urlFn(data) : urlFn;

      // body/params fixed hai ya dynamic
      const payload = typeof dataFn === "function" ? dataFn(data) : data;

      let response;
      if (method === "get" || method === "delete") {
        response = await api[method](url, { params: payload });
      } else {
        response = await api[method](url, payload);
      }

      if (!response?.data?.success) {
        return rejectWithValue(response?.data?.msg || "Something went wrong");
      }
      return response.data;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.msg || e?.message || "Something went wrong"
      );
    }
  });


  export default createApiThunk;