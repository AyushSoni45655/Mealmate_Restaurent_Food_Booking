import {
  signIn,signUp,
  signUpVerification,forgotPassword,
  forgetVerifyOtp,forgotSetPassword,getRefreshToken,
  getAllUsers,
  logOut
} from "../controllars/user.controllar.js"
import express from 'express';
import tokenAuth from '../middlewares/tokenAuth.js'
import upload from "../middlewares/multer.js";
const userRouter = express.Router();


userRouter.post("/signin",signIn);
userRouter.post("/signup",upload.single('image'),signUp);
userRouter.post("/signup-verify",signUpVerification);
userRouter.post("/forgot-password",forgotPassword);
userRouter.post("/forgot-verify-otp",forgetVerifyOtp);
userRouter.post("/forgot-set-password",forgotSetPassword);
userRouter.post("/refresh-token",getRefreshToken);
userRouter.get("/all-users",tokenAuth,getAllUsers)
userRouter.get("/user-logout",tokenAuth,logOut)
export default userRouter