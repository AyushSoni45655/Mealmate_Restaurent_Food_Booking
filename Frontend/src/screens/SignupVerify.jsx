import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { signUpVerification } from '../redux(state managemant)/slices/user.slice'
// import useMsgHandler from '../hooks/useMsgHandler'

const OTP_LENGTH = 6
const RESEND_SECONDS = 30

const SignupVerify = () => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS)
  const inputsRef = useRef([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { uLoading, uSuccess, uError } = useSelector((state) => state.user)

  // email should be passed from the signup page via navigate('/verify', { state: { email } })
  const email =  localStorage.getItem('email') || ''

  // useMsgHandler(uSuccess, uError, uSuccess ? '/login' : null)

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [resendTimer])

  const handleChange = (index, value) => {
    const clean = value.replace(/[^0-9]/g, '').slice(-1)
    const next = [...digits]
    next[index] = clean
    setDigits(next)
    if (clean && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((d, i) => (next[i] = d))
    setDigits(next)
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const otp = digits.join('')
  const isComplete = otp.length === OTP_LENGTH

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isComplete) return
    dispatch(signUpVerification({ email, otp }))
  }

  const handleResend = () => {
    if (resendTimer > 0) return
    // dispatch your resend-otp thunk here
    setResendTimer(RESEND_SECONDS)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
            We sent a {OTP_LENGTH}-digit code to{' '}
            <span className="text-neutral-800 font-medium">{email || 'your email'}</span>.
            Enter it below to verify your account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-lg font-medium rounded-lg border border-neutral-300 bg-white text-neutral-900
                           focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900
                           transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isComplete || uLoading}
            className="mt-6 w-full rounded-lg bg-neutral-900 text-white text-sm font-medium py-3
                       disabled:bg-neutral-300 disabled:cursor-not-allowed
                       hover:bg-neutral-800 transition-colors"
          >
            {uLoading ? 'Verifying…' : 'Verify account'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link to="/signup" className="text-neutral-500 hover:text-neutral-800">
            Wrong email?
          </Link>
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="text-neutral-900 font-medium disabled:text-neutral-400 disabled:cursor-not-allowed"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignupVerify