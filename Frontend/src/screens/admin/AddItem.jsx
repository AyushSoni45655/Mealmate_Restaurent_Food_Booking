



// import React, { useState, useEffect } from 'react'
// import { Upload, X } from 'lucide-react'
// import { categories, getSubCategory } from '../../assets/assets'
// import { toast } from 'react-hot-toast'
// import { useDispatch, useSelector } from 'react-redux'
// import useMsgHandler from '../../../utils/msgHandler'
// import { addProduct } from '../../redux(state managemant)/slices/product.slice'

// const Field = ({ label, children }) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-xs font-medium uppercase tracking-wide !text-white/50">
//       {label}
//     </label>
//     {children}
//   </div>
// )

// const inputClass = "outline-none h-11 px-3.5 rounded-lg bg-[#262626] border border-white/10 !text-white text-sm " +
//                     "placeholder:!text-white/30 focus:border-[#FF9F43]/60 transition-colors duration-150"

// const AddItem = () => {

//   const { pError, pSuccess, pLoading } = useSelector((state) => state.product)
//   const dispatch = useDispatch()

//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     price: '',
//     discountPrice: '',
//     category: '',
//     isFeatured: false,
//     spiceLevel: "",
//     servingSize: "",
//     isSpicy: false,
//     subCategory: '',
//     preparationTime: '',
//     foodType: 'Veg',
//     isAvailable: false,
//   })



  
//   // dynamic lists: ingredients & cooking steps
//   const [ingredients, setIngredients] = useState([''])
//   const [cookingInstructions, setCookingInstructions] = useState([''])
 
//   const handleListChange = (setter) => (index, value) => {
//     setter((prev) => {
//       const next = [...prev]
//       next[index] = value
//       return next
//     })
//   }
 
//   const addListItem = (setter) => () => {
//     setter((prev) => [...prev, ''])
//   }
 
//   const removeListItem = (setter) => (index) => {
//     setter((prev) => {
//       if (prev.length === 1) return [''] // keep at least one input
//       return prev.filter((_, i) => i !== index)
//     })
//   }

//   // single image: { file, url } or null
//   const [image, setImage] = useState(null)
//   const [subCategory, setsubCategory] = useState([])

//   const handleChange = (key) => (e) => {
//     setForm((prev) => ({ ...prev, [key]: e.target.value }))
//   }

//   const handleCheckbox = (key) => (e) => {
//     setForm((prev) => ({ ...prev, [key]: e.target.checked }))
//   }

//   const handlerSubcategory = () => {
//     if (!form.category) {
//       setsubCategory([])
//       return
//     }
//     const res = getSubCategory(form.category)
//     setsubCategory(res)
//   }

//   useEffect(() => {
//     handlerSubcategory()
//     // reset subCategory whenever category changes, so a stale value
//     // from the previous category doesn't get submitted
//     setForm((prev) => ({ ...prev, subCategory: '' }))
//   }, [form.category])

//   // revoke the old object URL whenever it's replaced/unmounted, to avoid memory leaks
//   useEffect(() => {
//     return () => {
//       if (image?.url) URL.revokeObjectURL(image.url)
//     }
//   }, [image])

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setImage((prev) => {
//       if (prev?.url) URL.revokeObjectURL(prev.url)
//       return { file, url: URL.createObjectURL(file) }
//     })

//     e.target.value = '' // allow re-selecting the same file
//   }

//   const removeImage = () => {
//     setImage((prev) => {
//       if (prev?.url) URL.revokeObjectURL(prev.url)
//       return null
//     })
//   }

//   useMsgHandler(pSuccess, pError)

//   const resetForm = () => {
//      setIngredients([''])
//     setCookingInstructions([''])
//     setImage(null)
//     setForm({
//       name: '',
//       description: '',
//       price: '',
//       discountPrice: '',
//       category: '',
//       isFeatured: false,
//       spiceLevel: '',
//       servingSize: '',
//       isSpicy: false,
//       subCategory: '',
//       preparationTime: '',
//       foodType: 'Veg',
//       isAvailable: false,
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     const { category, subCategory, description, name, price,
//       foodType, preparationTime, servingSize, spiceLevel } = form

//     // discountPrice deliberately left out — it's optional on the backend
//     const requiredData = { category, spiceLevel, subCategory, name, description, preparationTime, price, foodType, servingSize }

//     for (let key in requiredData) {
//       if (!requiredData[key]) {
//         toast.error(`Please Enter ${key}`)
//         return
//       }
//     }

//     if (!image) {
//       toast.error('Please select an image')
//       return
//     }

//        const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean)
//     const cleanInstructions = cookingInstructions.map((i) => i.trim()).filter(Boolean)

//     const formData = new FormData()
//     formData.append('image', image.file)
//     formData.append('isAvailable', form.isAvailable)
//     formData.append('isFeatured', form.isFeatured)
//     formData.append('isSpicy', form.isSpicy)
//     formData.append('discountPrice', form.discountPrice || '')

//      formData.append('ingredients', JSON.stringify(cleanIngredients))
//     formData.append('cookingInstructions', JSON.stringify(cleanInstructions))
//     for (let key in requiredData) {
//       formData.append(key, requiredData[key])
//     }

//     try {
//       const response = await dispatch(addProduct(formData)).unwrap()
//       if (response?.success) {
//         resetForm()
//       }
//     } catch (err) {
//       // errors already surfaced via useMsgHandler(pSuccess, pError)
//     }
//   }

//   return (
//     <div className="w-full min-h-screen bg-[#1a1a1a] px-6 py-8 flex flex-col gap-6">

//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold !text-white">Add New Item</h1>
//         <p className="text-sm !text-white/40 mt-1">Fill in the details to add a dish to your menu</p>
//       </div>

//       <form onSubmit={handleSubmit} className="w-full flex flex-col lg:flex-row gap-6">

//         {/* Image upload - single image */}
//         <div className="w-full lg:w-64 shrink-0">
//           <Field label="Item Image">
//             <div className="grid grid-cols-2 gap-3">
//               {image ? (
//                 <div className="relative aspect-square rounded-xl overflow-hidden bg-[#262626]">
//                   <img src={image.url} alt="Item" className="w-full h-full object-cover" />
//                   <button
//                     type="button"
//                     onClick={removeImage}
//                     className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 hover:bg-black/80 transition-colors"
//                   >
//                     <X size={12} className="!text-white" />
//                   </button>
//                 </div>
//               ) : (
//                 <label
//                   htmlFor="item-images"
//                   className="aspect-square rounded-xl bg-[#262626] border border-dashed border-white/15
//                              flex items-center justify-center cursor-pointer
//                              hover:border-[#FF9F43]/50 transition-colors duration-150"
//                 >
//                   <Upload size={18} className="!text-white/30" />
//                 </label>
//               )}
//             </div>

//             <input
//               id="item-images"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//             />
//             <p className="text-[11px] !text-white/30 mt-1">Upload one image for this item</p>
//           </Field>
//         </div>

//         {/* Form fields */}
//         <div className="flex-1 flex flex-col gap-5">

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Field label="Item Name">
//               <input
//                 type="text"
//                 placeholder="e.g. Cheese Burger"
//                 value={form.name}
//                 onChange={handleChange('name')}
//                 className={inputClass}
//               />
//             </Field>

//             <Field label="Price ($)">
//               <input
//                 type="number"
//                 placeholder="e.g. 10.00"
//                 value={form.price}
//                 onChange={handleChange('price')}
//                 className={inputClass}
//               />
//             </Field>

//             <Field label="Discount Price ($)">
//               <input
//                 type="number"
//                 placeholder="e.g. 10.00"
//                 value={form.discountPrice}
//                 onChange={handleChange('discountPrice')}
//                 className={inputClass}
//               />
//             </Field>
//           </div>

//           <Field label="Description">
//             <textarea
//               rows={3}
//               placeholder="Short description of the dish..."
//               value={form.description}
//               onChange={handleChange('description')}
//               className={`${inputClass} h-auto py-2.5 resize-none`}
//             />
//           </Field>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//             <Field label="Category">
//               <select value={form.category} onChange={handleChange('category')} className={inputClass}>
//                 <option value="" className="bg-[#262626]">Select</option>
//                 {categories.map((c) => <option key={c.id} value={c.name} className="bg-[#262626]">{c.name}</option>)}
//               </select>
//             </Field>

//             <Field label="Sub Category">
//               <select value={form.subCategory} onChange={handleChange('subCategory')} className={inputClass}>
//                 <option value="" className="bg-[#262626]">Select</option>
//                 {subCategory.map((c) => <option key={c.id} value={c.name} className="bg-[#262626]">{c.name}</option>)}
//               </select>
//             </Field>

//             <Field label="Spice Level">
//               <select value={form.spiceLevel} onChange={handleChange('spiceLevel')} className={inputClass}>
//                 <option value="" className="bg-[#262626]">Select</option>
//                 {["none", "mild", "medium", "hot"].map((c, id) => <option key={id} value={c} className="bg-[#262626]">{c}</option>)}
//               </select>
//             </Field>

//             <Field label="Preparation Time (mins)">
//               <input
//                 type="number"
//                 placeholder="e.g. 15"
//                 value={form.preparationTime}
//                 onChange={handleChange('preparationTime')}
//                 className={inputClass}
//               />
//             </Field>

//             <Field label="Serving Size">
//               <input
//                 type="text"
//                 placeholder="Enter the Serving size"
//                 value={form.servingSize}
//                 onChange={handleChange('servingSize')}
//                 className={inputClass}
//               />
//             </Field>
//           </div>

//           <div className="flex items-center gap-8 pt-1">
//             <Field label="Type">
//               <div className="flex gap-2">
//                 {["veg", "non-veg", "egg"].map((t) => (
//                   <button
//                     type="button"
//                     key={t}
//                     onClick={() => setForm((prev) => ({ ...prev, foodType: t }))}
//                     className={`px-4 h-10 rounded-lg text-sm font-medium border transition-colors duration-150 ${
//                       form.foodType === t
//                         ? 'bg-[#FF9F43] !text-[#1a1a1a] border-[#FF9F43]'
//                         : 'bg-[#262626] !text-white/60 border-white/10'
//                     }`}
//                   >
//                     {t}
//                   </button>
//                 ))}
//               </div>
//             </Field>

//             <Field label="IsAvailable">
//               <input
//                 type="checkbox"
//                 checked={!!form.isAvailable}
//                 onChange={handleCheckbox('isAvailable')}
//                 className="h-5 w-5"
//               />
//             </Field>

//             <Field label="IsFeatured">
//               <input
//                 type="checkbox"
//                 checked={!!form.isFeatured}
//                 onChange={handleCheckbox('isFeatured')}
//                 className="h-5 w-5"
//               />
//             </Field>

//             <Field label="isSpicy">
//               <input
//                 type="checkbox"
//                 checked={!!form.isSpicy}
//                 onChange={handleCheckbox('isSpicy')}
//                 className="h-5 w-5"
//               />
//             </Field>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center gap-3 pt-4">
//             <button
//               disabled={pLoading}
//               type="submit"
//               className="px-5 h-11 rounded-lg bg-[#FF9F43] !text-[#1a1a1a] font-medium text-sm
//                          hover:brightness-110 transition-all duration-150"
//             >
//               {pLoading ? "Processing" : "Save Item"}
//             </button>
//             <button
//               type="button"
//               onClick={resetForm}
//               className="px-5 h-11 rounded-lg bg-[#262626] border border-white/10 !text-white/70 font-medium text-sm
//                          hover:!text-white transition-colors duration-150"
//             >
//               Cancel
//             </button>
//           </div>

//         </div>
//       </form>
//     </div>
//   )
// }

// export default AddItem



import React, { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { categories, getSubCategory } from '../../assets/assets'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import useMsgHandler from '../../../utils/msgHandler'
import { addProduct } from '../../redux(state managemant)/slices/product.slice'

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium uppercase tracking-wide !text-white/50">
      {label}
    </label>
    {children}
  </div>
)

const inputClass = "outline-none h-11 px-3.5 rounded-lg bg-[#262626] border border-white/10 !text-white text-sm " +
                    "placeholder:!text-white/30 focus:border-[#FF9F43]/60 transition-colors duration-150"

const AddItem = () => {

  const { pError, pSuccess, pLoading } = useSelector((state) => state.product)
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    isFeatured: false,
    spiceLevel: "",
    servingSize: "",
    isSpicy: false,
    subCategory: '',
    preparationTime: '',
    foodType: 'Veg',
    isAvailable: false,
  })

  // single image: { file, url } or null
  const [image, setImage] = useState(null)
  const [subCategory, setsubCategory] = useState([])

  // dynamic lists: ingredients & cooking steps
  const [ingredients, setIngredients] = useState([''])
  const [cookingInstructions, setCookingInstructions] = useState([''])

  const handleListChange = (setter) => (index, value) => {
    setter((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const addListItem = (setter) => () => {
    setter((prev) => [...prev, ''])
  }

  const removeListItem = (setter) => (index) => {
    setter((prev) => {
      if (prev.length === 1) return [''] // keep at least one input
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleCheckbox = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.checked }))
  }

  const handlerSubcategory = () => {
    if (!form.category) {
      setsubCategory([])
      return
    }
    const res = getSubCategory(form.category)
    setsubCategory(res)
  }

  useEffect(() => {
    handlerSubcategory()
    // reset subCategory whenever category changes, so a stale value
    // from the previous category doesn't get submitted
    setForm((prev) => ({ ...prev, subCategory: '' }))
  }, [form.category])

  // revoke the old object URL whenever it's replaced/unmounted, to avoid memory leaks
  useEffect(() => {
    return () => {
      if (image?.url) URL.revokeObjectURL(image.url)
    }
  }, [image])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url)
      return { file, url: URL.createObjectURL(file) }
    })

    e.target.value = '' // allow re-selecting the same file
  }

  const removeImage = () => {
    setImage((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url)
      return null
    })
  }

  useMsgHandler(pSuccess, pError)

  const resetForm = () => {
    setImage(null)
    setIngredients([''])
    setCookingInstructions([''])
    setForm({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: '',
      isFeatured: false,
      spiceLevel: '',
      servingSize: '',
      isSpicy: false,
      subCategory: '',
      preparationTime: '',
      foodType: 'Veg',
      isAvailable: false,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { category, subCategory, description, name, price,
      foodType, preparationTime, servingSize, spiceLevel } = form

    // discountPrice deliberately left out — it's optional on the backend
    const requiredData = { category, spiceLevel, subCategory, name, description, preparationTime, price, foodType, servingSize }

    for (let key in requiredData) {
      if (!requiredData[key]) {
        toast.error(`Please Enter ${key}`)
        return
      }
    }

    if (!image) {
      toast.error('Please select an image')
      return
    }

    const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean)
    const cleanInstructions = cookingInstructions.map((i) => i.trim()).filter(Boolean)

    const formData = new FormData()
    formData.append('image', image.file)
    formData.append('isAvailable', form.isAvailable)
    formData.append('isFeatured', form.isFeatured)
    formData.append('isSpicy', form.isSpicy)
    formData.append('discountPrice', form.discountPrice || '')
    // arrays FormData me seedha nahi jaate, isliye JSON string bana ke bheja —
    // backend me JSON.parse() se wapas array bana lena
    formData.append('ingredients', JSON.stringify(cleanIngredients))
    formData.append('cookingInstructions', JSON.stringify(cleanInstructions))

    for (let key in requiredData) {
      formData.append(key, requiredData[key])
    }

    try {
      const response = await dispatch(addProduct(formData)).unwrap()
      if (response?.success) {
        resetForm()
      }
    } catch (err) {
      // errors already surfaced via useMsgHandler(pSuccess, pError)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] px-6 py-8 flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold !text-white">Add New Item</h1>
        <p className="text-sm !text-white/40 mt-1">Fill in the details to add a dish to your menu</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col lg:flex-row gap-6">

        {/* Image upload - single image */}
        <div className="w-full lg:w-64 shrink-0">
          <Field label="Item Image">
            <div className="grid grid-cols-2 gap-3">
              {image ? (
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#262626]">
                  <img src={image.url} alt="Item" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 hover:bg-black/80 transition-colors"
                  >
                    <X size={12} className="!text-white" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="item-images"
                  className="aspect-square rounded-xl bg-[#262626] border border-dashed border-white/15
                             flex items-center justify-center cursor-pointer
                             hover:border-[#FF9F43]/50 transition-colors duration-150"
                >
                  <Upload size={18} className="!text-white/30" />
                </label>
              )}
            </div>

            <input
              id="item-images"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-[11px] !text-white/30 mt-1">Upload one image for this item</p>
          </Field>
        </div>

        {/* Form fields */}
        <div className="flex-1 flex flex-col gap-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Item Name">
              <input
                type="text"
                placeholder="e.g. Cheese Burger"
                value={form.name}
                onChange={handleChange('name')}
                className={inputClass}
              />
            </Field>

            <Field label="Price ($)">
              <input
                type="number"
                placeholder="e.g. 10.00"
                value={form.price}
                onChange={handleChange('price')}
                className={inputClass}
              />
            </Field>

            <Field label="Discount Price ($)">
              <input
                type="number"
                placeholder="e.g. 10.00"
                value={form.discountPrice}
                onChange={handleChange('discountPrice')}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={3}
              placeholder="Short description of the dish..."
              value={form.description}
              onChange={handleChange('description')}
              className={`${inputClass} h-auto py-2.5 resize-none`}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Category">
              <select value={form.category} onChange={handleChange('category')} className={inputClass}>
                <option value="" className="bg-[#262626]">Select</option>
                {categories.map((c) => <option key={c.id} value={c.name} className="bg-[#262626]">{c.name}</option>)}
              </select>
            </Field>

            <Field label="Sub Category">
              <select value={form.subCategory} onChange={handleChange('subCategory')} className={inputClass}>
                <option value="" className="bg-[#262626]">Select</option>
                {subCategory.map((c) => <option key={c.id} value={c.name} className="bg-[#262626]">{c.name}</option>)}
              </select>
            </Field>

            <Field label="Spice Level">
              <select value={form.spiceLevel} onChange={handleChange('spiceLevel')} className={inputClass}>
                <option value="" className="bg-[#262626]">Select</option>
                {["none", "mild", "medium", "hot"].map((c, id) => <option key={id} value={c} className="bg-[#262626]">{c}</option>)}
              </select>
            </Field>

            <Field label="Preparation Time (mins)">
              <input
                type="number"
                placeholder="e.g. 15"
                value={form.preparationTime}
                onChange={handleChange('preparationTime')}
                className={inputClass}
              />
            </Field>

            <Field label="Serving Size">
              <input
                type="text"
                placeholder="Enter the Serving size"
                value={form.servingSize}
                onChange={handleChange('servingSize')}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex items-center gap-8 pt-1">
            <Field label="Type">
              <div className="flex gap-2">
                {["veg", "non-veg", "egg"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm((prev) => ({ ...prev, foodType: t }))}
                    className={`px-4 h-10 rounded-lg text-sm font-medium border transition-colors duration-150 ${
                      form.foodType === t
                        ? 'bg-[#FF9F43] !text-[#1a1a1a] border-[#FF9F43]'
                        : 'bg-[#262626] !text-white/60 border-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="IsAvailable">
              <input
                type="checkbox"
                checked={!!form.isAvailable}
                onChange={handleCheckbox('isAvailable')}
                className="h-5 w-5"
              />
            </Field>

            <Field label="IsFeatured">
              <input
                type="checkbox"
                checked={!!form.isFeatured}
                onChange={handleCheckbox('isFeatured')}
                className="h-5 w-5"
              />
            </Field>

            <Field label="isSpicy">
              <input
                type="checkbox"
                checked={!!form.isSpicy}
                onChange={handleCheckbox('isSpicy')}
                className="h-5 w-5"
              />
            </Field>
          </div>

          {/* Ingredients */}
          <Field label="Ingredients">
            <div className="flex flex-col gap-2">
              {ingredients.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`e.g. Cheese`}
                    value={item}
                    onChange={(e) => handleListChange(setIngredients)(index, e.target.value)}
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(setIngredients)(index)}
                    className="h-11 w-11 shrink-0 flex items-center justify-center rounded-lg bg-[#262626] border border-white/10 hover:border-white/20"
                  >
                    <X size={14} className="!text-white/50" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addListItem(setIngredients)}
                className="text-xs font-medium !text-[#FF9F43] self-start hover:brightness-110"
              >
                + Add Ingredient
              </button>
            </div>
          </Field>

          {/* Cooking Instructions */}
          <Field label="Cooking Instructions">
            <div className="flex flex-col gap-2">
              {cookingInstructions.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="h-11 flex items-center justify-center !text-white/30 text-xs w-5 shrink-0">
                    {index + 1}.
                  </span>
                  <textarea
                    rows={1}
                    placeholder={`Step ${index + 1}`}
                    value={item}
                    onChange={(e) => handleListChange(setCookingInstructions)(index, e.target.value)}
                    className={`${inputClass} flex-1 h-auto py-2.5 resize-none`}
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(setCookingInstructions)(index)}
                    className="h-11 w-11 shrink-0 flex items-center justify-center rounded-lg bg-[#262626] border border-white/10 hover:border-white/20"
                  >
                    <X size={14} className="!text-white/50" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addListItem(setCookingInstructions)}
                className="text-xs font-medium !text-[#FF9F43] self-start hover:brightness-110"
              >
                + Add Step
              </button>
            </div>
          </Field>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              disabled={pLoading}
              type="submit"
              className="px-5 h-11 rounded-lg bg-[#FF9F43] !text-[#1a1a1a] font-medium text-sm
                         hover:brightness-110 transition-all duration-150"
            >
              {pLoading ? "Processing" : "Save Item"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 h-11 rounded-lg bg-[#262626] border border-white/10 !text-white/70 font-medium text-sm
                         hover:!text-white transition-colors duration-150"
            >
              Cancel
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}

export default AddItem