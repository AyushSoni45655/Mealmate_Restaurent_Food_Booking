
import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // ==========================================
    // CATEGORY
    // ==========================================

    category: {
      type: String,
      required: true,
      trim: true,
      
      index: true,
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // ==========================================
    // PRICE
    // ==========================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    // ==========================================
    // IMAGES
    // ==========================================

   
     image: {
        type: String,
        trim: true,
      },
    

    // ==========================================
    // FOOD INFORMATION
    // ==========================================

    foodType: {
      type: String,
      enum: ["veg", "non-veg", "egg"],
      required: true,
      index: true,
    },

    isSpicy: {
      type: Boolean,
      default: false,
    },

    spiceLevel: {
      type: String,
      enum: ["none", "mild", "medium", "hot"],
      default: "none",
    },

    // ==========================================
    // SERVING INFORMATION
    // ==========================================

    servingSize: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    preparationTime: {
      type: Number,
      min: 0,
      default: 15,
    },

    // ==========================================
    // AVAILABILITY
    // ==========================================

    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================
    // PRODUCT STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ==========================================
    // RATINGS & REVIEWS
    // ==========================================

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    ingredients: {
  type: [String],
  default: [],
},
cookingInstructions: {
  type: [String],
  default: [],
},

    // ==========================================
    // ADMIN / AUDIT
    // ==========================================

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// DISCOUNT VALIDATION
// ==========================================

productSchema.pre("validate", function () { if ( this.discountPrice !== null && this.discountPrice !== undefined && this.discountPrice !== "" && this.discountPrice > this.price ) { throw new Error( "Discount price cannot be greater than original price" ); } });

// ==========================================
// MODEL
// ==========================================

const ProductModel =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

export default ProductModel;

