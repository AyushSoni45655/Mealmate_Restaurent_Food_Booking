import React, { useEffect, useState } from 'react'
import { categories, getSubCategory } from '../assets/assets'
import Card from './Card';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory,setSubCategory } from '../redux(state managemant)/slices/product.slice';
const Cards = () => {
  
  const dispatch = useDispatch();
  const [cCategory, setcCategory] = useState(categories[0].name);
   const allSubCategory = categories.find((state)=>state.name === cCategory);
  const {category,subCategoryy,allProduct,pLoading} = useSelector((state)=>state.product);
  const [cSubCategory,setCSubCategory] = useState(allSubCategory?.subcategories[0].name)

  // set initial value c,or sub category
  useEffect(()=>{
    handleCategory(cCategory);
    handleSubCategory(cSubCategory)
  },[cCategory,cSubCategory])

  useEffect(()=>{
    setCSubCategory(allSubCategory.subcategories[0].name)
  },[cCategory])
  const handleCategory = (mcategory)=>{
    if(mcategory){
       setcCategory(mcategory);
       dispatch(setCategory(mcategory));
    }
     
  }

  const handleSubCategory = (subcategory)=>{
    if(subcategory){
      setCSubCategory(subcategory);
      dispatch(setSubCategory(subcategory));
     
    }
    
  }

  console.log(category,subCategoryy);
  

  return (
    <div className='spacing pb-12'>

      <h2 className='text-lg font-semibold text-gray-800 mb-3'>Category</h2>
      <div className='flex items-center gap-2 scrollbar-hide overflow-x-auto pb-2'>
        {categories.map((item) => {
          const { id, name, icon: Icon } = item;
          const isActive = cCategory === name;
          return (
            <div
              key={id}
              onClick={() => handleCategory(name)}
              className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-md text-sm font-medium border transition-colors duration-150
                ${isActive
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
            >
              <Icon className='text-base' />
              {name}
            </div>
          );
        })}
      </div>

      <h2 className='text-lg font-semibold text-gray-800 mt-6 mb-3'>Sub Category</h2>
      <div className='flex items-center gap-2 scrollbar-hide overflow-x-auto pb-2'>
        {allSubCategory?.subcategories.map((item) => {
          const { id, name } = item;
          const isActive = cSubCategory === name;
          return (
            <div
              key={id}
              onClick={() => handleSubCategory(name)}
              className={`shrink-0 px-4 py-2 rounded-md text-sm font-medium border transition-colors duration-150
                ${isActive
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
            >
              {name}
            </div>
          );
        })}
      </div>

      {/* card show casing here */}
      <div className='w-full h-fit gap-6 mt-6 items-center justify-center flex flex-wrap'>
        {
          pLoading ? (<div className='loader'>Searching...</div>):
          allProduct.map((item)=>( <Card key={item._id} data={item}/>))
        }
      </div>
     

    </div>
  );
};

export default Cards;