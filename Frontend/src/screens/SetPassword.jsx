import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AiOutlineLock, AiOutlineArrowLeft } from 'react-icons/ai'
import InputField from "../componant/InputField.jsx"
import CustomButton from '../componant/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { setPassword } from '../redux(state managemant)/slices/user.slice.js'

const SetPassword = () => {
  const navigate = useNavigate()
const dispatch = useDispatch();

  // email + code passed from Otp.jsx via navigate state
  const { email,uSuccess,uLoading } = useSelector((state)=>state.user);

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
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

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    const result = await dispatch(setPassword({password:form.password,email})).unwrap();
    if(result.success){
      navigate("/signin",{replace:true})
    }
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>

        <Link
          to='/forgot'
          className='inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6'
        >
          <AiOutlineArrowLeft className='h-4 w-4' />
          Back
        </Link>

        <div className='mb-8'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Set new password</h1>
          <p className='text-sm text-gray-500 mt-2'>
            Choose a strong password for{' '}
            <span className='font-semibold text-gray-700'>{email || 'your account'}</span>
          </p>
        </div>

       
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <InputField
            data={{
              label: 'New Password',
              name: 'password',
              value: form.password,
              onChange: handleChange,
              isPass: true,
              Icon: AiOutlineLock,
              autoComplete: 'new-password',
              error: errors.password,
              required: true,
            }}
          />

          <InputField
            data={{
              label: 'Confirm New Password',
              name: 'confirmPassword',
              value: form.confirmPassword,
              onChange: handleChange,
              isPass: true,
              Icon: AiOutlineLock,
              autoComplete: 'new-password',
              error: errors.confirmPassword,
              required: true,
            }}
          />

          <CustomButton
            label='Reset Password'
            type='submit'
            loading={uLoading}
          />
        </form>
      </div>
    </div>
  )
}

export default SetPassword