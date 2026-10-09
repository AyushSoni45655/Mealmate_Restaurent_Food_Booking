import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AiOutlineMail, AiOutlineArrowLeft } from 'react-icons/ai'
import InputField from "../componant/InputField.jsx"
import CustomButton from '../componant/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import useMsgHandler from '../../utils/msgHandler.js'
import { forgetPassword, setEmail } from '../redux(state managemant)/slices/user.slice.js'


const Forgot = () => {
   const {uError,uSuccess,uLoading} = useSelector((state)=>state.user);
    useMsgHandler(uSuccess,uError,"/otp")
    const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmaill] = useState('')
  const [error, setError] = useState('')


  const handleChange = (e) => {
    setEmaill(e.target.value)
    if (error) setError('')
  }

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = await dispatch(forgetPassword({email})).unwrap()
     
    
    if(result.success){  
      dispatch(setEmail(email))
      
      navigate("/otp",{replace:true})
    }
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>

        <Link
          to='/signin'
          className='inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6'
        >
          <AiOutlineArrowLeft className='h-4 w-4' />
          Back to Sign In
        </Link>

        <div className='mb-8'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Forgot password?</h1>
          <p className='text-sm text-gray-500 mt-2'>
            No worries — enter your email and we'll send you a code to reset it.
          </p>
        </div>

      

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <InputField
            data={{
              label: 'Email',
              name: 'email',
              value: email,
              onChange: handleChange,
              isPass: false,
              Icon: AiOutlineMail,
              type: 'email',
              autoComplete: 'email',
              error: error,
              required: true,
            }}
          />

          <CustomButton
            label='Send Reset Code'
            type='submit'
            loading={uLoading}
          />
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Remembered your password?{' '}
          <Link to='/signin' className='font-semibold text-orange-500 hover:text-orange-600'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Forgot