


import React, { useState,useMemo } from 'react'
import ViewMore from '../../../utils/ViewMore'
import { categories } from '../../assets/assets.js'
import AdminProductCard from '../../componant/AdminProductCard'
import { getAllProducts, setCategory, setSubCategory } from '../../redux(state managemant)/slices/product.slice'
import useMsgHandler from '../../../utils/msgHandler'
import OrderReportsTable from "../../componant/OrderReports"
import {useDispatch,useSelector} from 'react-redux'
import { useEffect } from 'react'
const CATEGORIES = categories.map((item)=>item.name)


let  FilterSelect = ({ label, value, onChange, options }) => {
  
  return (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium uppercase tracking-wide !text-white/50">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="outline-none w-40 h-10 px-3 rounded-lg bg-[#262626] border border-white/10 !text-white text-sm
                 focus:border-[#FF9F43]/60 transition-colors duration-150"
    >
      {/* <option value="" className="bg-[#262626]">All</option> */}
      {options.map((item,id) => {
        
         const name = typeof item === 'string' ? item : item.name
        return (
        <option className="bg-[#262626]" key={id } value={name}>
          {name}
        </option>
      )})}
    </select>
  </div>
)
}

const DashBoard = () => {
  const dispatch = useDispatch()
  const { pError, pSuccess, category, subCategoryy, pLoading, allProduct ,page,limit } =
    useSelector((state) => state.product)

  useMsgHandler(pSuccess, pError)

  const mysub = useMemo(
    () => categories.find((item) => item.name === category)?.subcategories ?? [],
    [category]
  )
  const subNames = useMemo(
    () => mysub.map((s) => (typeof s === 'string' ? s : s.name)),
    [mysub]
  )

  // Set a default category only if none is selected
  useEffect(() => {
    if (!category) dispatch(setCategory(CATEGORIES[0]))
  }, [category, dispatch])

  useEffect(()=>{
    dispatch(setSubCategory(subNames[0]))
  },[category,dispatch,subNames])



  // Fetch only when the pair is valid, so a stale sub category never triggers a request
  const filtersReady = category && subNames.includes(subCategoryy)
  useEffect(() => {
    if (filtersReady) dispatch(getAllProducts({
      category,subCategory:subCategoryy,page,limit
    }))
  }, [filtersReady, category, subCategoryy, dispatch])

  const products = Array.isArray(allProduct) ? allProduct : []


  

  
  
  

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] px-6 py-8 flex flex-col gap-10">
      <div className="w-full flex items-center justify-between flex-wrap gap-4">
        <FilterSelect
          label="Category"
          value={category}
          onChange={(e) => dispatch(setCategory(e.target.value))}
          options={CATEGORIES}
        />
        <FilterSelect
          label="Sub Category"
          value={subCategoryy}
          onChange={(e) => dispatch(setSubCategory(e.target.value))}
          options={subNames}
        />
      </div>

      <section className="flex flex-col gap-4">
        <ViewMore label="Popular Dishes" />
        {pLoading ? (
          <p className="text-white/50 text-sm">Loading dishes…</p>
        ) : products.length === 0 ? (
          <p className="text-white/50 text-sm">No dishes in this category yet.</p>
        ) : (
          <div className="w-full flex flex-wrap gap-4">
            {products.map((p) => (
              <AdminProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <ViewMore label="Order Reports" />
        <OrderReportsTable />
      </section>
    </div>
  )
}



export default DashBoard

