import WishListModal from "../model/wishlist.modal.js";
import mongoose from "mongoose";
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, msg: 'invalid productId' });
    }
    if (!userId) {
      return res.status(401).json({ success: false, msg: 'unauthorized' });
    }

    const removed = await WishListModal.findOneAndDelete({ user: userId, product: productId });

    if (!removed) {
      await WishListModal.create({ user: userId, product: productId });
    }

    const wishlists = await WishListModal.find({ user: userId })
      .select('product -_id')
      .lean();
    const ids = wishlists.map((item) => String(item.product));

    return res.status(200).json({
      success: true,
      msg: removed ? 'Removed from wishlist' : 'Added to wishlist',
      isWishlisted: !removed,
      ids,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Toggle Error : ${err.message}` });
  }
};

const getWishListIds  = async(req,res)=>{
  try{
    
    
     const userId = req.user.id;
    if(!userId){
       return res.status(400).json({ success: false,  msg: 'userid is empty' });
    }

    const wishlists = await WishListModal.find({user:userId}).select('product -_id').lean();;
    const ids = wishlists.map((item)=>String(item.product));
    return res.status(200).json({success:true,msg:wishlists.length < 1 ? "No wishlist found":'Fetched all wishlist',ids})
  }catch(e){
    return res.status(500).json({ success: false, msg: `getch Ids Error : ${e.message}` });
  }
}

const getFaivrateItems  = async(req,res)=>{
  try{
const userId = req.user.id;
if(!userId){
  return res.status(400).json({ success: false, msg: `Authentication id is empty` });
}
const products = await WishListModal.find({user:userId}).populate('product').sort({createdAt:-1});
const data = products.map((f)=>f.product).filter(Boolean);
return res.status(200).json({ success: true, msg: `Find all Faivrate`,data });
  }catch(e){
    return res.status(500).json({ success: false, msg: `Faivrate Items : ${e.message}` });
  }
}
export {toggleWishlist,getWishListIds,getFaivrateItems}