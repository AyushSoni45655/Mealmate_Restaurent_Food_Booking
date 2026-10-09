import mongoose,{Schema} from 'mongoose';

const wishListSchema = new Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:true
  }
},{timestamps:true});

const WishListModal = mongoose.models.WishList || mongoose.model('WishList',wishListSchema);

wishListSchema.index({ user: 1, product: 1 }, { unique: true });
 
// Fast "get all wishlist items for this user, newest first" queries.
wishListSchema.index({ user: 1, createdAt: -1 });

export default WishListModal;