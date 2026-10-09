// seedAdmin.js
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import UserModel from './model/user.model.js';
import { hashPassword } from './utils/hashPassword.js';
const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,{dbName:"mealMate"}); // apna DB connection string
  
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    // check karo pehle se exist to nahi karta
    const existing = await UserModel.findOne({ email: adminEmail, role: "admin" });
    if (existing) {
      console.log("Admin already exists, skipping.");
      return process.exit(0);
    }

    const hashedPassword = await hashPassword(adminPassword)

    const admin = await UserModel.create({
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      name:"Ayush Soni Admin",
      userName:"ayushsoni45655",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIVg0Rtv20y5SaDVzqDfKE2KCNVDBJWC_p0Zx43Rwzlw&s"
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();