
import React from 'react'
import { assets, adminNavigation } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='min-h-screen w-32 md:w-52 flex flex-col bg-[#1c1c1c]'>
      {/* logo */}
      <div className='flex items-center justify-center rounded-full  h-28 shrink-0'>
        <img src={assets.mymeal} alt='logo' className='w-24 h-24 rounded-full  object-cover' />
      </div>

      {/* nav */}
      <div className='relative flex-1 w-full'>
        {/* curved highlight panel behind the labels */}
        <div className='absolute inset-y-4 left-2 right-0 bg-[#333333] rounded-l-[28px] rounded-r-[28px]' />

        <div className='relative z-10 flex flex-col md:items-start items-center h-full justify-evenly py-6'>
          {adminNavigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 pl-4 pr-6 py-2 transition-colors ${
                    isActive ? 'text-red-500 font-semibold' : 'text-gray-300 hover:text-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className='flex items-center justify-center w-8 h-8'>
                      <Icon size={18} />
                    </span>
                    <span className='text-sm hidden md:block'>{item.name}</span>
                    {isActive && (
                      <span className='ml-auto hidden md:block w-1.5 h-1.5 rounded-full bg-red-500' />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Sidebar