import React from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const ViewMore = ({ label, to = '/' }) => {
  return (
    <div className="w-full flex items-center justify-between">
      <h2 className="text-xl md:text-2xl font-semibold !text-white">
        {label}
      </h2>

      <NavLink
        to={to}
        className="group flex items-center gap-1 !text-gray-400 hover:!text-[#FF9F43] transition-colors duration-200"
      >
        <p className="text-sm font-medium cursor-pointer">View More</p>
        <ArrowRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </NavLink>
    </div>
  )
}

export default ViewMore