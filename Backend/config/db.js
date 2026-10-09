import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async()=>{
try{

   if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

  mongoose.connection.on('error', (e)=>{
    console.log(`Mongodb Connection Error : ${e.message}`);
  });
  mongoose.connection.on('connected', ()=>{
    console.log(`Mongodb Connection Connected`);
  })
   mongoose.connection.on('disconnected', ()=>{
    console.log(`Mongodb Connection Dishconnected`);
  })

  await mongoose.connect(process.env.MONGODB_URI,{dbName:"mealMate"})

}catch(e){
  console.log(e.message);
  throw new Error(e.message);
}
}

export default connectDB;