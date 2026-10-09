import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { redirect, useNavigate } from "react-router-dom"
import {toast} from 'react-hot-toast'
import { cleanUserMsg } from "../src/redux(state managemant)/slices/user.slice";
const useMsgHandler = (success,error,redirect)=>{
const navigate = useNavigate();
const dispatch = useDispatch();
useEffect(()=>{
  if(error){
    toast.error(error);
    dispatch(cleanUserMsg());
  }
  if(success){
    toast.success(success);
    dispatch(cleanUserMsg());
    if(redirect){
      navigate(redirect,{replace:true})
    }
  }

},[dispatch,error,success,navigate,redirect])
}
export default useMsgHandler