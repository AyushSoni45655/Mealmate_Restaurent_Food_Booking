import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({

  name: {
    type: String,
    trim: true,
    required:true
  },
  userName: {
    type: String,
    unique: true,
    trim: true,
    required:true,
    lowercase: true
  },
  image:{
    type:String,
    default:"",
    required:true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  refreshToken: {
    type: String,
    select: false
  },
  isResetPasswordOtpVerify:{
    type:Boolean,
    default:false,
    select:false
  },
  phone:{
    type:Number,
    // required:true,
    unique:true,
  },
  resetPasswordOtp: {
    type: String,
    select: false
  },
  resetPasswordOtpExpiry: {
    type: Date,
    select: false
  },

   // Account verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    select: false
  },
  verificationLockUntil: { 
    type: Date,
     default: null,
      select: false
     },
  verificationTokenExpiry: {
    type: Date,
    select: false
  },
  verificationAttempts:{
    type:Number,
    default:0,
    select:false
  },

  loginAttempts: {
  type: Number,
  default: 0,
  select: false
},
lockUntil: {
  type: Date,
  select: false
},
role: {
  type: String,
  enum: ["customer", "admin"],
  default: "customer"
},
isActive: {
  type: Boolean,
  default: true
}

}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;