import mongoose , {Schema} from 'mongoose'


const orderSchema = new Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  items:[
    {
      product:{type:mongoose.Schema.Types.ObjectId},
      name:String,
      image:String,
      price:Number,
      quantity:Number,
    },
  ],
  deliveryAddress:{
    fullName:String,
    phone:String,
    addressLine:String,
    landmark:String,
    city:String,
    pincode:String
  },
  notes:String,
  itemTotal:Number,
  deliveryFee:Number,
  tax:Number,
  total:Number,
  paymentMethod:{type:String,enum:['cod','razorpay'],required:true},
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  orderStatus: { type: String, enum: ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], default: 'placed' },
  razorpay: { orderId: String, paymentId: String, signature: String },
  paidAt: Date,

},{timestamps:true});

const OrderModal = mongoose.models.Order || mongoose.model("Order",orderSchema);

export default OrderModal;