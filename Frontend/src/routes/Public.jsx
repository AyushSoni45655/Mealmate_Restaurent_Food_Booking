import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Public = ({children}) => {
   
  const {token} = useSelector((state)=>state.user);
  if(token){
    return <Navigate to="/app" replace/>
  }
  return children;
}

export default Public
