import razorpay from "../config/razorpay.js";
import crypto from 'crypto';
import CartModal from '../model/cart.modal.js';
import OrderModal from "../model/order.modal.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();

const FREE_DELIVERY_ABOVE = 500;
const DELIVERY_FEE = 40;
const GST_RATE = 0.05

const safeEqual = (a = '', b = '') =>
  a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

const createOrder = async(req,res)=>{
  
  
try{
  const userId = req.user.id;
  if(!userId){
     return res.status(400).json({success:false,msg:`Autentication failed `})
  }
  const {
    deliveryAddress,
    paymentMethod,
    notes
  } = req.body;

  if(!['cod','razorpay'].includes(paymentMethod)){
     return res.status(400).json({success:false,msg:`Invalid payment method`})
  }

  const cart = await CartModal.findOne({user:userId}).populate('items.product');
  const items = (cart?.items || []).filter((i)=>i.product);
  if(!items.length)return res.status(400).json({success:false,msg:"cart is empty"});

  if(items.some(({product})=>!product.inStock || !product.isAvailable)){
    return res.status(400).json({success:false,msg:`some items are unvailable`})
  }

    const orderItems = items.map(({ product, quantity }) => ({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.discountPrice ?? product.price,
      quantity,
    }));


    const itemTotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = itemTotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
    const tax = Math.round(itemTotal * GST_RATE * 100) / 100;
    const total = itemTotal + deliveryFee + tax;

    const order = await OrderModal.create({
      user: userId,
      items: orderItems,
      deliveryAddress,
      notes,
      itemTotal, deliveryFee, tax, total,
      paymentMethod,
    });


     // Cash on delivery: done, clear cart
     
    if (paymentMethod === 'cod') {
      cart.items = [];
      await cart.save();
      return res.status(201).json({ success: true,msg:"Order Created Successfully" ,data:{orderId:order._id,paymentMethod: 'cod'} });
    }

    // Online: create the Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // paise
      currency: 'INR',
      receipt: order._id.toString(),
      notes: { orderId: order._id.toString(), userId: userId.toString() },
    });

    order.razorpay.orderId = rzpOrder.id;
    await order.save();

     res.status(201).json({
      success: true,
      msg:'Order Created Successfully',
      data:{
      orderId: order._id,
      paymentMethod: 'razorpay',
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_API_KEY,
      }
     
    });

}catch(e){
  return res.status(500).json({success:false,msg:`Create Order Error : ${e.message}`})
}
}


// POST /api/orders/verify
 const verifyPayment = async (req, res) => {
  try {
    console.log("i am hittteeeddd hereeee",req.body);
    console.log(req.user.id);
    
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await OrderModal.findOne({
      'razorpay.orderId': razorpay_order_id,
      user: req.user.id,
    });
    if (!order) return res.status(404).json({success:false, msg: 'Order not found' });

    // Already marked paid (e.g. webhook arrived first)
    if (order.paymentStatus === 'paid') {
      return res.json({ success: true, msg:"payment completed",orderId: order._id });
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (!safeEqual(expected, razorpay_signature)) {
      return res.status(400).json({success:false, msg: 'Payment verification failed' });
    }

    order.paymentStatus = 'paid';
    order.paidAt = new Date();
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;
    await order.save();

    await CartModal.updateOne({ user: req.user.id }, { $set: { items: [] } });

    res.json({ success: true,msg:"verification completed", orderId: order._id });
  } catch (err) {
    console.error('verifyPayment', err);
    res.status(500).json({ success:false,msg: 'Verification error' });
  }
};


// POST /api/payments/webhook  (raw body, no auth)
 const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body) // req.body is a raw Buffer here
      .digest('hex');

    if (!safeEqual(expected, signature)) return res.status(400).json({success:false,msg:"Invalid signature"});

    const event = JSON.parse(req.body.toString());
    const payment = event.payload?.payment?.entity;
    if (!payment) return res.status(200).json({success:false,msg:"Ignored"});

    const order = await OrderModal.findOne({ 'razorpay.orderId': payment.order_id });
    if (!order) return res.status(200).json({success:false,msg:"Order not found"});

    if (['payment.captured', 'order.paid'].includes(event.event) && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.paidAt = new Date();
      order.razorpay.paymentId = payment.id;
      await order.save();
      await CartModal.updateOne({ user: order.user }, { $set: { items: [] } });
    }

    if (event.event === 'payment.failed' && order.paymentStatus === 'pending') {
      order.paymentStatus = 'failed';
      await order.save();
    }

    res.status(200).json({success:true,msg:"verification completed"});; // always reply 200 quickly
  } catch (err) {
    console.error('webhook', err);
    res.status(500).json({success:false,msg:"something went wrong in webhook"});
  }
};

const fetchAllOrders = async(req,res)=>{
  try{
    const userId = req.user.id;
    if(!userId){
      return res.status(400).json({success:false,msg:'Authentication Failed userid is empty'});
    }
    if(req.user.role=== 'admin'){
      const orders = await OrderModal.find({}).populate("user",'image')
      return res.status(200).json({success:true,msg:orders.length > 0 ? 'Fetch Order Successfully':'Orders not found',orders})
    }
    const orders = await OrderModal.find({user:userId});
    return res.status(200).json({success:true,msg:orders.length > 0 ? 'Fetch Order Successfully':'Orders not found',orders})
  }catch(e){
    return res.status(500).json({success:false,msg:`Fetch Order Error : ${e.message}`})
  }
}


const TRANSITIONS = {
  placed:['preparing','cancelled'],
  preparing:['out_for_delivery','cancelled'],
  out_for_delivery:['delivered'],
  delivered:[],
  cancelled:[]
}

const updateOrderStatus = async(req,res)=>{
  console.log("runnner");
  
  try{
     const userId = req.user.id;
    if(!userId){
      return res.status(400).json({success:false,msg:'Authentication Failed userid is empty'});
    }

    if(req.user.role !== 'admin'){
      return res.status(400).json({success:false,msg:'You are now allowed to change the status'});
    }
    const {orderId,orderStatus} = req.body;
    if(!orderId || !orderStatus){
      return res.status(400).json({success:false,msg:'orderid or orderstatus is required'});
    }

    if(!mongoose.isValidObjectId(orderId)){
      return res.status(400).json({success:false,msg:'Invalid Order id'});
    }
    
     if(!Object.keys(TRANSITIONS).includes(orderStatus)){
      return res.status(400).json({success:false,msg:'Invalid Order Status'});
    }
    
    
    const myOrder = await OrderModal.findById(orderId);
     if(!myOrder){
      return res.status(400).json({success:false,msg:'order not found !!!'});
    }

    if(!TRANSITIONS[myOrder.orderStatus].includes(orderStatus)){
      return res.status(400).json({success:false,msg:`Can't change status from ${myOrder.orderStatus} to ${orderStatus}`});
    }
    if(myOrder.paymentMethod === 'cod' && orderStatus === 'delivered'){
      myOrder.paymentStatus = "paid";
    }

    myOrder.orderStatus = orderStatus;
    await myOrder.save();
    return res.status(200).json({success:true,msg:'Order Status Changed Successfully',order:myOrder});

  }catch(e){
    return res.status(500).json({success:false,msg:`Order Status Updation Error : ${e.message}`});
  }
}

export {createOrder,verifyPayment,razorpayWebhook,fetchAllOrders,updateOrderStatus}