import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const Private = ({children}) => {
  
  const {token,user} = useSelector((state)=>state.user);
  if(!token){
    console.log("hllo");
    
    return <Navigate to="/signin" replace/>
  }
  if (!user?.isVerified && user.role === "customer") return <Navigate to="/signup-verify" replace />
  return children;
}

export default Private
