

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlineCrown } from 'react-icons/ai'
import InputField from "../componant/InputField.jsx"
import CustomButton from '../componant/CustomButton'
import useMsgHandler from '../../utils/msgHandler.js'
import { signIn } from '../redux(state managemant)/slices/user.slice.js'
// import { loginUser } from '../redux/slices/userSlice' // TODO: point this at your actual thunk

const SignIn = () => {
  const {uError,uSuccess,uLoading} = useSelector((state)=>state.user);
  useMsgHandler(uSuccess,uError)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [role, setRole] = useState('customer') 
  
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email'
    }
    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const {email,password} = form;
     dispatch(signIn({email,password,role}))
   
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>

        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Welcome back</h1>
          <p className='text-sm text-gray-500 mt-2'>Sign in to continue to MealMate</p>
        </div>

        {/* role toggle */}
        <div className='flex bg-gray-100 rounded-full p-1 mb-6'>
          {
            ['customer','admin'].map((data,id)=>( <button key={id} 
            type='button'
            onClick={() => setRole(data)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-all
              ${role === 'customer' ? 'bg-white shadow text-black' : 'text-gray-500'}
            `}
          >
            <AiOutlineUser className='h-4 w-4' />
            {data}
          </button>))
          }
        </div>

     

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <InputField
            data={{
              label: 'Email',
              name: 'email',
              value: form.email,
              onChange: handleChange,
              isPass: false,
              Icon: AiOutlineMail,
              type: 'email',
              autoComplete: 'email',
              error: errors.email,
              required: true,
            }}
          />

          <InputField
            data={{
              label: 'Password',
              name: 'password',
              value: form.password,
              onChange: handleChange,
              isPass: true,
              Icon: AiOutlineLock,
              autoComplete: 'current-password',
              error: errors.password,
              required: true,
            }}
          />

          {role === 'customer' && (
            <div className='flex justify-end -mt-2'>
              <Link
                to='/forgot'
                className='text-sm font-medium text-orange-500 hover:text-orange-600'
              >
                Forgot password?
              </Link>
            </div>
          )}

          <CustomButton
            label={role === 'admin' ? 'Sign In as Admin' : 'Sign In'}
            type='submit'
            loading={uLoading}
          />
        </form>

        {role === 'customer' && (
          <p className='text-center text-sm text-gray-500 mt-6'>
            Don't have an account?{' '}
            <Link to='/signUp' className='font-semibold text-orange-500 hover:text-orange-600'>
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default SignIn