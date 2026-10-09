


import React from 'react'
import { Star, TrendingUp } from 'lucide-react'

const AdminProductCard = ({
 product
}) => {
  return (
    <div className="w-60 bg-[#262626] rounded-3xl p-5 flex flex-col items-center gap-4 shadow-lg shadow-black/20 hover:-translate-y-1 transition-transform duration-200">

      {/* Product image */}
      <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-inner">
        <img
          className="w-full h-full object-cover rounded-full"
          src={product.image}
          alt={name}
        />
      </div>

      {/* Name + price */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-white text-base font-semibold leading-snug">
          {product.name.substring(0,20)}
        </h2>
        <span className="text-[#FF9F43] text-lg font-bold">
          ${product.price}
        </span>
      </div>
      

      {/* Divider */}
      <div className="w-full h-px bg-white/10" />

      {/* Stats row */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white/90">
          <Star size={16} className="fill-[#FFC542] text-[#FFC542]" />
          <span className="text-sm font-medium">{product.rating}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-white text-sm font-semibold">{product.totalOrders || 25}</span>
          <span className="text-white/40 text-[11px] uppercase tracking-wide">
            Total Sale
          </span>
        </div>
      </div>
    </div>
  )
}

export default AdminProductCard