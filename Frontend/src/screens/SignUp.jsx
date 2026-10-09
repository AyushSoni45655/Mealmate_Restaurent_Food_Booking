import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlinePhone, AiOutlineCamera } from 'react-icons/ai'
import InputField from '../componant/InputField'
import CustomButton from '../componant/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import useMsgHandler from '../../utils/msgHandler'
import { setEmail, signUp } from '../redux(state managemant)/slices/user.slice'

const SignUp = () => {
  const {uError,uSuccess,uLoading} = useSelector((state)=>state.user);
  useMsgHandler(uSuccess,uError)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    userName:"",
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [profileImage, setProfileImage] = useState(null) // actual File object, sent to backend
  const [previewUrl, setPreviewUrl] = useState(null) // object URL, for <img> preview only
  const [imageError, setImageError] = useState('')
  const [errors, setErrors] = useState({})


  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError('')

    // basic validation: type + size
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be under 5MB')
      return
    }

    // revoke previous preview url to avoid memory leaks
    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setProfileImage(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setProfileImage(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = () => {
    const newErrors = {}

     if (!form.userName.trim()) {
      newErrors.userName = 'userName is required'
    }

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit number'
    }

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

    try {
      

      // use FormData since we're sending a file alongside text fields
      const payload = new FormData()
      payload.append('name', form.name)
      payload.append('userName', form.userName)
      payload.append('email', form.email)
      payload.append('phone', form.phone)
      payload.append('password', form.password)
      if (profileImage) payload.append('image', profileImage)
         const result = await dispatch(signUp(payload)).unwrap();
        
        
      if(result.success){
        dispatch(setEmail(form.email))
      }
      
     
    } catch (err) {
      
      
    } 
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>

        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Create account</h1>
          <p className='text-sm text-gray-500 mt-2'>Join MealMate and start ordering</p>
        </div>

       

        {/* profile image upload + preview */}
        <div className='flex flex-col items-center mb-6'>
          <div className='relative'>
            <div className='w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center'>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt='Profile preview'
                  className='w-full h-full object-cover'
                />
              ) : (
                <AiOutlineUser className='h-10 w-10 text-gray-400' />
              )}
            </div>

            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow-md transition-colors'
              aria-label='Upload profile photo'
            >
              <AiOutlineCamera className='h-4 w-4' />
            </button>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='hidden'
            />
          </div>

          {previewUrl && (
            <button
              type='button'
              onClick={handleRemoveImage}
              className='text-xs text-red-500 hover:text-red-600 mt-2 font-medium'
            >
              Remove photo
            </button>
          )}

          {imageError && (
            <span className='text-xs text-red-500 mt-2'>{imageError}</span>
          )}
          {!imageError && !previewUrl && (
            <span className='text-xs text-gray-400 mt-2'>Add a profile photo (optional)</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

            <InputField
            data={{
              label: 'UserName',
              name: 'userName',
              value: form.userName,
              onChange: handleChange,
              isPass: false,
              Icon: AiOutlineUser,
              autoComplete: 'User Name',
              error: errors.userName,
              required: true,
            }}
          />

          <InputField
            data={{
              label: 'Full Name',
              name: 'name',
              value: form.name,
              onChange: handleChange,
              isPass: false,
              Icon: AiOutlineUser,
              autoComplete: 'name',
              error: errors.name,
              required: true,
            }}
          />

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
              label: 'Phone Number',
              name: 'phone',
              value: form.phone,
              onChange: handleChange,
              isPass: false,
              Icon: AiOutlinePhone,
              type: 'tel',
              autoComplete: 'tel',
              error: errors.phone,
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
              autoComplete: 'new-password',
              error: errors.password,
              required: true,
            }}
          />

          <InputField
            data={{
              label: 'Confirm Password',
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
            label='Create Account'
            type='submit'
            loading={uLoading}
          />
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Already have an account?{' '}
          <Link to='/signin' className='font-semibold text-orange-500 hover:text-orange-600'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp