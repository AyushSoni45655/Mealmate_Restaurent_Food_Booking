import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

const InputField = ({ data }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

  const {
    label,
    name,
    value,
    onChange,
    isPass = false,
    Icon,
    type = 'text',
    error,
    disabled = false,
    required = false,
    placeholder,
    autoComplete,
  } = data

  const inputType = isPass ? (showPassword ? 'text' : 'password') : type

  return (
    <div className='w-full flex flex-col gap-1'>
      <label htmlFor={name} className='text-sm font-medium text-gray-700'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>

      <div
        className={`flex items-center w-full rounded-md border-2 px-3 py-2 transition-colors
          ${error ? 'border-red-500' : focused ? 'border-black' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-white'}
        `}
      >
        {Icon && (
          <Icon className='h-5 w-5 text-gray-400 mr-2 shrink-0' />
        )}

        <input
          className='flex-1 border-none outline-none bg-transparent disabled:cursor-not-allowed text-sm'
          type={inputType}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          
          autoComplete={autoComplete}
          placeholder={placeholder || `Enter your ${label}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />

        {isPass && (
          <button
            type='button'
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className='ml-2 shrink-0 text-gray-500 hover:text-black transition-colors'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <AiOutlineEye className='h-5 w-5' />
            ) : (
              <AiOutlineEyeInvisible className='h-5 w-5' />
            )}
          </button>
        )}
      </div>

      {error && (
        <span id={`${name}-error`} className='text-xs text-red-500'>
          {error}
        </span>
      )}
    </div>
  )
}

export default InputField