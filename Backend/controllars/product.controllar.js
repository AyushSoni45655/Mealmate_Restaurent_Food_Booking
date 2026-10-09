
import fs from 'fs';
import ImageKitt from '../config/imagekits.js';
import ProductModel from '../model/product.modal.js';
import mongoose from 'mongoose';

const addProduct = async (req, res) => {
  try {
    console.log("My Data:", req.body);

    // =========================
    // AUTH
    // =========================

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "User Authentication required!",
      });
    }

    // =========================
    // DATA
    // =========================

    const {
      ingredients,
      cookingInstructions,
      name,
      description,
      category,
      subCategory,
      discountPrice,
      price,
      foodType,
      isFeatured,
      isSpicy,
      spiceLevel,
      servingSize,
      preparationTime,
    } = req.body;

    // =========================
    // REQUIRED FIELDS
    // =========================

    const requiredFields = {
      name,
      description,
      category,
      subCategory,
      price,
      foodType,
      spiceLevel,
      servingSize,
    };


    let parsedIngredients = [];
let parsedInstructions = [];

    try {
  parsedIngredients = ingredients ? JSON.parse(ingredients) : [];
  parsedInstructions = cookingInstructions ? JSON.parse(cookingInstructions) : [];
} catch (e) {
  return res.status(400).json({ success: false, msg: "Invalid ingredients or instructions format" });
}

    for (const [key, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || String(value).trim() === "") {
        return res.status(400).json({
          success: false,
          msg: `Enter the ${key}`,
        });
      }
    }

    // =========================
    // IMAGE VALIDATION
    // =========================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        msg: "No Image exist",
      });
    }

    // =========================
    // UPLOAD IMAGES
    // =========================

    let image;

    if(req.file) {
      const file = req.file;
      const buffer = fs.readFileSync(file.path);

      const response = await ImageKitt.upload({
        file: buffer,
        fileName: file.originalname,
        folder: "/mealmate/products",
      });

      const imagee = ImageKitt.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { width: "1280" },
          { format: "webp" },
        ],
      });

      image = imagee;

      fs.unlinkSync(file.path);
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        msg: "Image upload failed",
      });
    }

    // =========================
    // CREATE PRODUCT
    // =========================

    const foodData = await ProductModel.create({
      name: name.trim(),
      description: description.trim(),

      category: category.trim().toLowerCase(),
      subCategory: subCategory.trim().toLowerCase(),

      price: Number(price),

      discountPrice:
        discountPrice !== undefined && discountPrice !== ""
          ? Number(discountPrice)
          : null,

      foodType,

      isSpicy: isSpicy === "true",
      isFeatured: isFeatured === "true",

      spiceLevel,

      servingSize: servingSize.trim(),

      preparationTime:
        preparationTime !== undefined && preparationTime !== ""
          ? Number(preparationTime)
          : 15,

      image,
      ingredients: parsedIngredients,
      cookingInstructions: parsedInstructions,

      createdBy: userId,
    });

    

    return res.status(201).json({
      success: true,
      msg: "Food is Added Successfully",
      data: foodData,
    });

  } catch (e) {
    
     console.error("Add Food Error:", e);
  if (req.file?.path && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path); // cleanup even on failure
  }

    return res.status(500).json({
      success: false,
      msg: `Add Food Error: ${e.message}`,
    });
  }
};

const getAllProduct = async(req,res)=>{

  try{
  console.log(req.query);
  
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const {category,subCategory} = req.query;
    const userId = req.user?.id;

    if(!userId){
      return res.status(400).json({success:false,msg:"User Id Is Empty"})
    }
   const filter = {};
   if(category) filter.category = category.toLowerCase();
   if(subCategory) filter.subCategory = subCategory.toLowerCase();

    const totalProducts = await ProductModel.countDocuments(filter);
    const products = await ProductModel.find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(limit);

    return res.status(200).json({success:true,msg:products.length > 0 ? 'Products is Fetched':'No Product Found',products,pagination:{
      currentPage:page,
      totalPages:Math.ceil(totalProducts / limit),
      totalProducts,
      hasNextPage: page * limit < totalProducts,
      hasPrevPage:page > 1
    }})

  }catch(e){
     console.error("Get Products Error:", e);
    return res.status(500).json({success:false,msg:`Get Products Error : ${e.message}`})
  }
}



const updateProductStatus = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, msg: 'Unauthorized' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Access denied' });
    }

    const { id, isActive, isAvailable } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, msg: 'A valid product id is required' });
    }

    const updates = {};
    for (const [key, value] of Object.entries({ isActive, isAvailable })) {
      if (value === undefined) continue;
      if (typeof value !== 'boolean') {
        return res.status(400).json({ success: false, msg: `${key} must be a boolean` });
      }
      updates[key] = value;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, msg: 'Provide isActive and/or isAvailable' });
    }

    const product = await ProductModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, msg: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      msg: 'Product status updated successfully',
      product,
    });
  } catch (e) {
    console.error('Update product status error:', e);
    return res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};

 export { addProduct,getAllProduct,updateProductStatus} 
