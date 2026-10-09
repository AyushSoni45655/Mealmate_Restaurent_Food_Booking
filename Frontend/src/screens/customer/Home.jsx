import React from 'react'
import LandingPage from '../../componant/LandingPage'

import Cards from '../../componant/Cards';
import Pagination from '../../componant/Pagination';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../redux(state managemant)/slices/product.slice';
import { getWishListIds } from '../../redux(state managemant)/slices/wishlist.slice';
const Home = () => {
  const {category,subCategoryy,page,limit} = useSelector((state)=>state.product);
  console.log('it is my original',category,subCategoryy);
  
  const dispatch = useDispatch();
  
  useEffect(() => {
  if (!category || !subCategoryy) return; // avoid calling on null

  dispatch(getAllProducts({
    category: category.toLowerCase(),
    subCategory: subCategoryy.toLowerCase(),
    page,
    limit
  }));
}, [category, subCategoryy, page, limit,dispatch]);

// get all wishlistIds
useEffect(()=>{
  dispatch(getWishListIds());
},[dispatch])
  return (
    <div className='w-full h-fit flex flex-col'>
     <LandingPage/>
     {/* cards page here */}
     <Cards/>

     {/* here is a pagination  */}
     <div className='w-full h-fit flex items-center justify-center'><Pagination/></div>
    </div>
  )
}

export default Home
