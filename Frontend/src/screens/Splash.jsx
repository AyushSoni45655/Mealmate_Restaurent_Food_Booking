import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const Splash = () => {
  const [done, setDone] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // trigger entrance animation on mount
    const enter = setTimeout(() => setShow(true), 100)

    const timer = setTimeout(() => {
      localStorage.setItem('splash', "false")
      setDone(true)
    }, 3000)

    return () => {
      clearTimeout(enter)
      clearTimeout(timer)
    }
  }, [])

  if (done) {
    return <Navigate to="/signin" replace />
  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 overflow-hidden relative'>

      {/* decorative background blobs */}
      <div className='absolute -top-20 -left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl'></div>
      <div className='absolute -bottom-24 -right-16 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl'></div>

      {/* logo mark */}
      <div
        className={`transition-all duration-700 ease-out ${
          show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-90'
        }`}
      >
        <div className='w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center mb-6 mx-auto'>
          <span className='text-5xl'>🍽️</span>
        </div>
      </div>

      {/* title */}
      <h1
        className={`text-white text-4xl font-extrabold tracking-tight transition-all duration-700 delay-150 ease-out ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        MealMate
      </h1>

      {/* tagline */}
      <p
        className={`text-white/80 text-sm mt-2 font-medium tracking-wide transition-all duration-700 delay-300 ease-out ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        Good food, delivered fast
      </p>

      {/* loading dots */}
      <div className='flex gap-2 mt-10'>
        <span className='w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></span>
        <span className='w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></span>
        <span className='w-2.5 h-2.5 bg-white rounded-full animate-bounce'></span>
      </div>

      {/* bottom brand strip */}
      <div className='absolute bottom-8 text-white/60 text-xs tracking-widest uppercase'>
        v1.0.0
      </div>
    </div>
  )
}

export default Splash