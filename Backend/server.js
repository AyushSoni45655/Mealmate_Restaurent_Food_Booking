import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import userRouter from './routers/user.route.js';
import productRouter from './routers/product.routers.js';
import wishlistRouter from './routers/wishlist.router.js';
import cartRouter from './routers/cart.routers.js';
import orderRouter from './routers/order.routers.js';
import { razorpayWebhook } from './controllars/order.controllars.js';
// middlewares



// 1. Webhook FIRST, with raw body. Signature check needs the exact bytes.
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), razorpayWebhook);


const allowedOrigins = [process.env.FRONTEND_URL,"http://localhost:2003"]
app.use(express.json({}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser({}))

// cors connection here
app.use(cors({
  methods:["GET","POST","PUT","DELETE","PATCH"],
  allowedHeaders:["content-type","Authorization","X-Custom-Token"],
  
  credentials:true,
  origin:function(origin,callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null,true)
    }else{
      callback(new Error("ERROR: NOT ALLOWED BY CORS"))
    }
  }
}));

// routes

app.use("/api/user",userRouter)
app.use("/api/food",productRouter)
app.use("/api/wishlist",wishlistRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.get("/",(req,res)=>{

  res.send({
    message:"Server Is Running!!!✅✅✅✅",
    
  })

});




const port = process.env.PORT || 5000;

async function startServer(port){

  await connectDB()
  const data = app.listen(port);
  data.on("error",(error)=>{
    if(error.code ==="EADDRINUSE"){
      console.log(`PORT ${port} is already in use , trying to use PORT ${port+1} Instead`);
      startServer(port + 1)
    } else{
      console.log(`Error Occured:${error.message}`)
    }
    
    
  });
  data.on("listening",()=>{
    console.log(`Server is listening on http://localhost:${port}`)
  })
}

//call the function to start the server
startServer(port);
