// import React, { useEffect, useMemo, useState } from 'react'
// import { Plus, Search } from 'lucide-react'
// import AdminProductCard from '../../componant/AdminProductCard'
// import { NavLink } from 'react-router-dom'
// import { categories } from '../../assets/assets'
// import {useSelector,useDispatch} from 'react-redux'
// import useMsgHandler from '../../../utils/msgHandler'
// import { getAllProducts, setCategory,setSubCategory } from '../../redux(state managemant)/slices/product.slice'

// const CATEGORIES = categories.map((item)=>item.name);

// const FOOD_TYPE = ['Non-Veg','Veg','Egg'];

// const MenuManage = () => {
//   const dispatch = useDispatch();
//   const {page,limit,category,subCategoryy,allProduct,pagination, pSuccess,pError,pLoading} = useSelector((state)=>state.product);
//   console.log('I am workk',category,subCategoryy,page,limit);
  
//   const [search, setSearch] = useState('')
//   const [fType, setfType] = useState("")

 
 
//   const sCategory = categories.find((item) => item.name === category)?.subcategories.map((s) => s.name) ?? [];

//   const [updateData, setupdateData] = useState({
//     _id:"",
//     isAvailable:false,
//     isActive:false
//   });
//   const onChangeHandler = (e)=>{

//   }

//  useEffect(()=>{
//   console.log("I am runns");
  
//   dispatch(setCategory(CATEGORIES[0]));
//    dispatch(setSubCategory(categories[0].subcategories[0].name))
//  },[dispatch])
 
//   useMsgHandler(pSuccess,pError)
//  useEffect(()=>{
  
//   if(!category || !subCategoryy)return
  
  
//     dispatch(getAllProducts({category,subCategory:subCategoryy,page,limit}))
  
  
//  },[dispatch,category,subCategoryy])
 

//  const categoryChageHandler = (e)=>{
//    dispatch(setCategory(e.target.value));
//    dispatch(setSubCategory(""))
//  }


//    const getDiscountPercent = (price, salePrice) => {
//   if (!price || !salePrice || salePrice >= price) return 0;
//   return Math.round(((price - salePrice) / price) * 100);
// };


// let myData = useMemo(()=>{
//   const query = search.trim().toLowerCase();
//   const ft = fType.trim().toLowerCase()
//   return allProduct.filter((item)=>{
//     const nameMatch = !query || item.name.toLowerCase().startsWith(query);
//     const fTypeMatch = !ft || item.foodType.toLowerCase().startsWith(ft);
//     return nameMatch && fTypeMatch
//   })
// }, [allProduct,search,fType])

  
//   return (
//     <div className="w-full min-h-screen bg-[#1a1a1a] px-6 py-8 flex flex-col gap-6">

//       {/* Header */}
//       <div className="w-full flex items-center justify-between flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold !text-white">Menu Management</h1>
//           <p className="text-sm !text-white/40 mt-1">Add, edit or remove items from your menu</p>
//         </div>

//         <NavLink to={`/app/admin/menu-page/add-item`} className="flex items-center gap-2 bg-[#FF9F43] !text-[#1a1a1a] font-medium text-sm
//                            px-4 py-2.5 rounded-lg hover:brightness-110 transition-all duration-150">
//           <Plus size={16} strokeWidth={2.5} />
//           Add Item
//         </NavLink>
//       </div>

//       {/* Search + filter */}
//       <div className="w-full flex items-center gap-4 flex-wrap">
//         <div className="flex items-center gap-2 bg-[#262626] border border-white/10 rounded-lg px-3 h-10 w-full max-w-xs">
//           <Search size={16} className="!text-white/40 shrink-0" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search menu items..."
//             className="bg-transparent outline-none w-full text-sm !text-white placeholder:!text-white/30"
//           />
//         </div>

//         <select
//           value={category}
//           onChange={categoryChageHandler}
//           className="outline-none h-10 px-3 rounded-lg bg-[#262626] border border-white/10 !text-white text-sm"
//         >
//           <option value="" className="bg-[#262626]">All Categories</option>
//           {CATEGORIES.map((item) => (
//             <option className="bg-[#262626]" key={item} value={item}>{item}</option>
//           ))}
//         </select>
//         <select
//           value={subCategoryy}
//           onChange={(e) => dispatch(setSubCategory(e.target.value))}
//           className="outline-none h-10 px-3 rounded-lg bg-[#262626] border border-white/10 !text-white text-sm"
//         >
//           <option value="" className="bg-[#262626]">Sub Categories</option>
//           {sCategory.map((item) => (
//             <option className="bg-[#262626]" key={item.toLowerCase()} value={item}>{item}</option>
//           ))}
//         </select>

//         {/* food type here */}
//         <select name="fType
//         " id="" value={fType} onChange={(e)=>setfType(e.target.value)} className='outline-none h-10 px-3 rounded-lg bg-[#262626] border border-white/10 !text-white text-sm'>
//           <option >Food Type</option>
//           {
//           FOOD_TYPE.map((item)=>(<option key={item.toLowerCase()} className='bg-[#262626]' value={item}>{item}</option>))
//           }
//         </select>
//       </div>

//      {/* here is table product table */}

//       <table className="w-full min-w-[640px] text-sm">
//         <thead>
//           <tr className="border-b border-white/10">
//             {['Product ID', 'Name', 'Price','Discount', 'Available', 'Active', 'Food Type'].map((head) => (
//               <th
//                 key={head.toLowerCase()}
//                 className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wide !text-white/40"
//               >
//                 {head}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-white/5">

//         {
//           myData.length === 0 && (
//              <tr>
//               <td colSpan="7" className="px-5 py-3.5 !text-white/70 text-center">
//                 No product Found
//               </td>
//             </tr>
//           )
//         }
//           {pLoading ? (
//             <tr>
//               <td colSpan="7" className="px-5 py-3.5 !text-white/70 text-center">
//                 Loading...
//               </td>
//             </tr>
//           ) : (
//             myData.map((item) => (
//               <tr key={item.id} className="hover:bg-white/[0.03] transition-colors  duration-150">
//                 <td className="px-5 py-3.5 !text-white/70 font-medium">#{item._id.substring(item._id.length - 8)}</td>
//                 <td className="px-5 py-3.5 !text-white flex gap-2 items-center">
//                   <img src={item.image} alt={item.name.substring(0,20)} className='h-10 w-10 rounded-full' />
//                   <p>{item.name.substring(0,20)}</p>
//                 </td>
//                 <td className="px-5 py-3.5 !text-white/70">{item.price}</td>
//                 <td className="px-5 py-3.5 !text-white/70">{getDiscountPercent(item.price, item.discountPrice)}</td>
//                 <td className="px-5 py-3.5    ">
//                  <div className='flex gap-2 items-center'>
//                   <p>{item.isAvailable ? ('Yes'):("No")}</p>
//                  <input type="checkbox" name="isAvailable" id="" checked={updateData.isAvailable} onChange={(e) => onChangeHandler(e)} />
//                  </div>
                 
//                 </td>

//                 <td className="px-5 py-3.5 !text-white/50  h-fit w-fit ">
//                 <div className='flex gap-2 items-center'>
//                   <p>{item.isActive ? ('Yes'):("No")}</p>
//                   <input type="checkbox" name="isActive" id="" checked={updateData.isActive} onChange={(e) => onChangeHandler(e)} />
//                 </div>
                  
//                 </td>

//                 <td className="px-5 py-3.5 !text-white/50">
//                   {item.foodType}
//                 </td>
//               </tr>
//             ))
//           )
//           }
//         </tbody>
//       </table>

//     </div>
//   )
// }

// export default MenuManage




import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { categories } from '../../assets/assets'
import useMsgHandler from '../../../utils/msgHandler'
import {
  getAllProducts,
  setCategory,
  setSubCategory,
  updateStatus
} from '../../redux(state managemant)/slices/product.slice'

const CATEGORIES = categories.map((item) => item.name)
const FOOD_TYPE = ['Non-Veg', 'Veg', 'Egg']

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={onChange}
    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150
      ${checked ? 'bg-[#FF9F43]' : 'bg-white/20'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-150
        ${checked ? 'translate-x-4' : ''}`}
    />
  </button>
)

const selectClass =
  'outline-none h-10 px-3 rounded-lg bg-[#262626] border border-white/10 !text-white text-sm'

const getDiscountPercent = (price, salePrice) => {
  if (!price || !salePrice || salePrice >= price) return 0
  return Math.round(((price - salePrice) / price) * 100)
}

const MenuManage = () => {
  const dispatch = useDispatch()
  const {
    page,
    limit,
    category,
    subCategoryy,
    allProduct = [],
    pSuccess,
    pError,
    pLoading,
  } = useSelector((state) => state.product)

  const [search, setSearch] = useState('')
  const [fType, setfType] = useState('')
  const [updating, setUpdating] = useState(null) // "productId-field"

  const sCategory =
    categories.find((item) => item.name === category)?.subcategories.map((s) => s.name) ?? []

  // default category + subcategory
  useEffect(() => {
    dispatch(setCategory(CATEGORIES[0]))
    dispatch(setSubCategory(categories[0].subcategories[0].name))
  }, [dispatch])

  useMsgHandler(pSuccess, pError)

  // products fetch
  useEffect(() => {
    if (!category || !subCategoryy) return
    dispatch(getAllProducts({ category, subCategory: subCategoryy, page, limit }))
  }, [dispatch, category, subCategoryy, page, limit])

  const categoryChageHandler = (e) => {
    const value = e.target.value
    dispatch(setCategory(value))
    const firstSub = categories.find((c) => c.name === value)?.subcategories[0]?.name ?? ''
    dispatch(setSubCategory(firstSub))
  }

  // search + food type filter (dono saath kaam karte hain)
  const myData = useMemo(() => {
    const query = search.trim().toLowerCase()
    const ft = fType.toLowerCase()
    return allProduct.filter((item) => {
      const nameMatch = !query || item.name.toLowerCase().startsWith(query)
      const fTypeMatch = !ft || item.foodType.toLowerCase() === ft
      return nameMatch && fTypeMatch
    })
  }, [allProduct, search, fType])

  // toggle handler
  const toggleHandler = async (item, field) => {
    const key = `${item._id}-${field}`
    setUpdating(key)
   
    
    try {
       await dispatch(updateStatus({ id: item._id, [field]: !item[field] })).unwrap()
    } catch (e) {
      // rollback slice mein ho jayega, toast useMsgHandler dikha dega
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] px-6 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold !text-white">Menu Management</h1>
          <p className="text-sm !text-white/40 mt-1">Add, edit or remove items from your menu</p>
        </div>

        <NavLink
          to="/app/admin/menu-page/add-item"
          className="flex items-center gap-2 bg-[#FF9F43] !text-[#1a1a1a] font-medium text-sm
                     px-4 py-2.5 rounded-lg hover:brightness-110 transition-all duration-150"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Item
        </NavLink>
      </div>

      {/* Search + filters */}
      <div className="w-full flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-[#262626] border border-white/10 rounded-lg px-3 h-10 w-full max-w-xs">
          <Search size={16} className="!text-white/40 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            className="bg-transparent outline-none w-full text-sm !text-white placeholder:!text-white/30"
          />
        </div>

        <select value={category} onChange={categoryChageHandler} className={selectClass}>
          {CATEGORIES.map((item) => (
            <option className="bg-[#262626]" key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={subCategoryy}
          onChange={(e) => dispatch(setSubCategory(e.target.value))}
          className={selectClass}
        >
          {sCategory.map((item) => (
            <option className="bg-[#262626]" key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={fType} onChange={(e) => setfType(e.target.value)} className={selectClass}>
          <option value="" className="bg-[#262626]">
            Food Type
          </option>
          {FOOD_TYPE.map((item) => (
            <option key={item} className="bg-[#262626]" value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Product table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {['Product ID', 'Name', 'Price', 'Discount', 'Available', 'Active', 'Food Type'].map(
                (head) => (
                  <th
                    key={head}
                    className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wide !text-white/40"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {pLoading ? (
              <tr>
                <td colSpan="7" className="px-5 py-3.5 !text-white/70 text-center">
                  Loading...
                </td>
              </tr>
            ) : myData.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 py-3.5 !text-white/70 text-center">
                  No product found
                </td>
              </tr>
            ) : (
              myData.map((item) => (
                <tr key={item._id} className="hover:bg-white/[0.03] transition-colors duration-150">
                  <td className="px-5 py-3.5 !text-white/70 font-medium">
                    #{item._id.substring(item._id.length - 8)}
                  </td>

                  <td className="px-5 py-3.5 !text-white">
                    <div className="flex gap-2 items-center">
                      <img
                        src={item.image}
                        alt={item.name.substring(0, 20)}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <p>{item.name.substring(0, 20)}</p>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 !text-white/70">{item.price}</td>

                  <td className="px-5 py-3.5 !text-white/70">
                    {getDiscountPercent(item.price, item.discountPrice)}%
                  </td>

                  <td className="px-5 py-3.5 !text-white/70">
                    <div className="flex gap-3 items-center">
                      <Toggle
                        checked={!!item.isAvailable}
                        disabled={updating === `${item._id}-isAvailable`}
                        onChange={() => toggleHandler(item, 'isAvailable')}
                      />
                      <span className="text-xs">{item.isAvailable ? 'Yes' : 'No'}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 !text-white/70">
                    <div className="flex gap-3 items-center">
                      <Toggle
                        checked={!!item.isActive}
                        disabled={updating === `${item._id}-isActive`}
                        onChange={() => toggleHandler(item, 'isActive')}
                      />
                      <span className="text-xs">{item.isActive ? 'Yes' : 'No'}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 !text-white/50">{item.foodType}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MenuManage