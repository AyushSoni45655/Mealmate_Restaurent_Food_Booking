


import Sidebar from './comman-componant/Sidebar'
import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayOut = () => {
  return (
    <div className='w-screen h-screen flex overflow-hidden'>
      <aside className='h-screen sticky top-0 shrink-0 shadow'>
        <Sidebar />
      </aside>

      {/* outlet here */}
      <div className='flex-1 h-screen overflow-y-auto bg-[#1D1D1D] text-white'>
       <Suspense fallback={<div className="p-6">Loading...</div>}>
         <Outlet />
       </Suspense>
      </div>

    </div>
  )
}

export default AdminLayOut