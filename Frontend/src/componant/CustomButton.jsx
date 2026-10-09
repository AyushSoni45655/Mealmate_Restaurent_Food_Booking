import React from 'react'

const CustomButton = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  className = '',
}) => {
  const baseStyles = 'rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 active:scale-95',
    secondary: 'bg-gray-100 text-black hover:bg-gray-200 active:scale-95',
    outline: 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}
    >
      {loading ? (
        <span className='h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin' />
      ) : (
        label
      )}
    </button>
  )
}

export default CustomButton