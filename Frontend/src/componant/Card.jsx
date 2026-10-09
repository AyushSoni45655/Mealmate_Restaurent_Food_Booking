import React from 'react'
import { NavLink } from 'react-router-dom';
import { FaHeart } from "react-icons/fa";
import {toast} from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishList } from '../redux(state managemant)/slices/wishlist.slice';
import useMsgHandler from '../../utils/msgHandler';
const Card = ({data}) => {
  
const {wSuccess,wError, wishListIds} = useSelector((state)=>state.wishlist)
  // useMsgHandler(wSuccess,wError)
  const dispatch = useDispatch();
  const handlerToggleWishList = (productId)=>{
    if(!productId){
      toast.error('product id is empty');
      return;
    }
dispatch(toggleWishList({productId}))
  }

  const isWishList = wishListIds.includes(data._id)
  
  return (
    <div className='md:w-72 group relative hover:scale-110  w-full h-fit p-2 shadow  items-center justify-center flex flex-col rounded-2xl'>
      {/* seen for navigate to details page */}

      <NavLink to={`/app/${data._id}`}><div className='h-fit w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:block hidden px-4 py-2 shadow rounded-md text-black text-lg font-bold tracking-wide cursor-pointer'>Seen</div></NavLink>
       {/* toggle icon here for toggle the product */}
      <div onClick={()=>handlerToggleWishList(data._id)} className='p-1 h-fit w-fit rounded-full border-2 border-amber-400 absolute  top-4 right-10 z-10'><FaHeart className={`h-6 w-6 ${isWishList ? 'text-red-600':'text-gray-500'} `}/></div>
      {/* image  */}
      <div className='h-60 rounded-lg   w-60 '>
       
        
        <img className='h-full w-full rounded-lg object-center z-0  object-cover' src={data.image} alt="product" />
      </div>
      {/* details */}
      <div className='w-full h-fit flex items-center justify-center flex-col gap-1'>
        <h1 className='text-md font-semibold capitalize'>{data.name?.substring(0,20)}</h1>
        <p className='text-gray-50 tracking-tight'>Diffrent types of dish & Naan</p>
        <span>🔥89 Calories</span>
        <p><span className='text-sm text-yellow-500 font-bold'>$</span > <span className='text-3xl font-bold text-black'>{Number(78).toFixed(2)}</span></p>
      </div>
    </div>
  )
}

export default Card
