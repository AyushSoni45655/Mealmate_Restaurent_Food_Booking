import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const SemiVerified = ({children}) => {
  
  
 const { token, user } = useSelector((state) => state.user)
  if (!token) return <Navigate to="/signup" replace /> // token hi nahi to verify kis cheez ka
  if (user?.isVerified) return <Navigate to="/app" replace /> // already verified, verify page ki zaroorat nahi
  return children
}

export default SemiVerified
