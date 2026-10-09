import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import CustomButton from '../componant/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { fPasswordOtpVerify } from '../redux(state managemant)/slices/user.slice'

const RESEND_SECONDS = 30

const Otp = () => {
  const {email,uError,uSuccess,uLoading} = useSelector((state)=>state.user);

  const dispatch = useDispatch();
  
  const navigate = useNavigate()
  const location = useLocation()

  
  

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')

  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(RESEND_SECONDS)

  const inputRefs = useRef([])

 

  // countdown for resend button
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return // only allow single digit

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (error) setError('')

    // auto-focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    e.preventDefault()
    const newOtp = pasted.split('')
    while (newOtp.length < 6) newOtp.push('')
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    

    if (code.length < 6) {
      setError('Please enter the complete 6-digit code')
      return
    }
    const result = await dispatch(fPasswordOtpVerify({email,otp:code})).unwrap();
    if(result.success){
      navigate("/SetPassword",{replace:true})
    }

  }

  const handleResend = async () => {
    try {
      setResending(true)
      // TODO: replace with real API call
      // await dispatch(resendOtp({ email, purpose })).unwrap()
      await new Promise((resolve) => setTimeout(resolve, 800)) // fake delay

      setTimer(RESEND_SECONDS)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err?.message || 'Could not resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>

        <Link
          to={'/signUp'}
          className='inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6'
        >
          <AiOutlineArrowLeft className='h-4 w-4' />
          Back
        </Link>

        <div className='mb-8'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Verify your email</h1>
          <p className='text-sm text-gray-500 mt-2'>
            We've sent a 6-digit code to{' '}
            <span className='font-semibold text-gray-700'>{email || 'your email'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='flex justify-between gap-2' onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-md border-2 outline-none transition-colors
                  ${error ? 'border-red-500' : 'border-gray-300 focus:border-black'}
                `}
              />
            ))}
          </div>

          {error && (
            <p className='text-xs text-red-500 -mt-4'>{error}</p>
          )}

          <CustomButton
            label='Verify'
            type='submit'
            loading={uLoading}
          />
        </form>

        <div className='text-center text-sm text-gray-500 mt-6'>
          {timer > 0 ? (
            <span>Resend code in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className='font-semibold text-orange-500 hover:text-orange-600 disabled:opacity-50'
            >
              {resending ? 'Resending...' : 'Resend code'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Otp