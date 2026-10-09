import fs from 'fs';
import validator from 'validator';
import ImageKitt from '../config/imagekits.js';
import jwt from 'jsonwebtoken';
import UserModel from '../model/user.model.js';
import { comparePassword, genrateToken, hashPassword } from '../utils/hashPassword.js';
import sendEmail, { otpTemplate, verificationTemplate } from '../utils/sendMail.js';
import mongoose from 'mongoose';

const signUp = async (req, res) => {
  console.log("i am hitted");
  
  let tempImagePath;
  try {
    console.log("data signup",req.body);
    
    const { name, userName, email, password ,phone} = req.body;
    
    const data = { name, userName, email, password ,phone};

    for (let key in data) {
      if (!data[key]) {
        return res.status(400).json({ success: false, msg: `Enter the ${key}` });
      }
    }
 
    if(!validator.isMobilePhone(String(phone),"en-IN")){
      return res.status(400).json({ success: false, msg: "Invalid phone number" });
    }
       const phoneNumber = Number(phone)
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, msg: "Password must be at least 8 characters" });
    }
   

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: `User already registered with this ${email}` });
    }

    let image;
    if (req.file) {
      tempImagePath = req.file.path;
      const buffer = fs.readFileSync(tempImagePath);

      const response = await ImageKitt.upload({
        file: buffer,
        fileName: req.file.originalname,
        folder: "/mealmate",
      });

      image = ImageKitt.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { width: "1280" },
          { format: "webp" },
        ],
      });
    }

    const hashedPassword = await hashPassword(password);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await hashPassword(otp.toString());
    console.log(otp);
    
    const newUser = await UserModel.create({
      name,
      userName,
      email,
      phone:phoneNumber,
      password: hashedPassword,
      image,
      isVerified: false,
      verificationToken: hashedOtp,
      verificationTokenExpiry: Date.now() + 10 * 60 * 1000
    });

    const { accessToken, refreshToken } = genrateToken({id:newUser._id,role:'customer'});
    newUser.refreshToken = await hashPassword(refreshToken);
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    console.log("My otp",otp);

    
    try {
      await sendEmail({
        to: email,
        subject: "Verify Your MealMate Account",
        html: verificationTemplate(otp)
      });
    } catch (emailError) {
      console.log(`Verification email failed: ${emailError.message}`);
    }

    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.verificationToken;
    delete userResponse.verificationTokenExpiry;

    return res.status(201).json({ success: true, msg: "Signup Completed", user: userResponse, accessToken });

  } catch (e) {
    return res.status(500).json({ success: false, msg: `Signup Error: ${e.message}` });
  } finally {
    if (tempImagePath && fs.existsSync(tempImagePath)) {
      fs.unlinkSync(tempImagePath);
    }
  }
};

const signIn = async (req, res) => {
  
  try {
    const {  email, password , role } = req.body;
    const data = {email, password , role };

    for (let key in data) {
      if (!data[key]) {
        return res.status(400).json({ success: false, msg: `Enter the ${key}` });
      }
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }
   
    const allowedRole = ["customer", "admin"];
    if (!allowedRole.includes(role)) {
      return res.status(400).json({ success: false, msg: "Invalid role" });
    }

    const existingUser = await UserModel.findOne({ email , role }).select('+password +loginAttempts +lockUntil');
    if (!existingUser) {
      return res.status(400).json({ success: false, msg: `Invalid Credential` });
    }
    if(existingUser.lockUntil && existingUser.lockUntil > Date.now()){
      return res.status(403).json({ success: false, msg: "Account locked. Try again later." });
    }

    const iscomparePassword = await comparePassword(password,existingUser.password);
    if(!iscomparePassword){
      existingUser.loginAttempts += 1;
      if(existingUser.loginAttempts >= 5){
        existingUser.lockUntil = Date.now() + 15 * 60 * 1000;
      }
      await existingUser.save();
       return res.status(400).json({ success: false, msg: `Invalid Credential` });
    }

    const { accessToken, refreshToken } = genrateToken({id:existingUser._id,role});
    existingUser.refreshToken = await hashPassword(refreshToken);
    existingUser.loginAttempts = 0;
    existingUser.lockUntil = undefined;
    await existingUser.save();

       res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const userResponse = existingUser.toObject();
delete userResponse.password;
delete userResponse.refreshToken;
delete userResponse.loginAttempts;
delete userResponse.lockUntil;
delete userResponse.verificationToken;
delete userResponse.verificationTokenExpiry;

    return res.status(200).json({ success: true, msg: "SignIn Completed", user: userResponse, accessToken });

  } catch (e) {
    return res.status(500).json({ success: false, msg: `Signin Error: ${e.message}` });
  } 
};

const forgotPassword = async (req, res) => {
  
  try {
    const {email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, msg: `Enter the Email` });
      }
    

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }
   
   
    const existingUser = await UserModel.findOne({email}).select("+resetPasswordOtp +resetPasswordOtpExpiry +isResetPasswordOtpVerify");

    if (existingUser) {
       const otp = Math.floor(100000 + Math.random() * 900000);
  const hashOtp = await hashPassword(otp.toString());

  try {
      await sendEmail({
        to: email,
        subject: "Verify Your Otp",
        html: otpTemplate(otp)
      });
      existingUser.isResetPasswordOtpVerify = false;
      existingUser.resetPasswordOtp = hashOtp;
      existingUser.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;
      await existingUser.save()
    } catch (emailError) {
      console.log(`Verification email failed: ${emailError.message}`);
    }
     
    }

   

    return res.status(200).json({ success: true, msg: "If email is right the verify the otp" });

  } catch (e) {
    return res.status(500).json({ success: false, msg: `Forgot Error: ${e.message}` });
  } 
};

const forgetVerifyOtp = async (req, res) => {
  
  try {
    console.log(req.body);
    
    const {email , otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ success: false, msg: `Enter the Email or Otp` });
      }
    

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }
   
      if (String(otp).length !== 6) {
      return res.status(400).json({ success: false, msg: "Otp must be 6 digit" });
    }
   
    const existingUser = await UserModel.findOne({email}).select("+resetPasswordOtp +resetPasswordOtpExpiry +isResetPasswordOtpVerify");

    if (!existingUser) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

      if (!existingUser.resetPasswordOtp || !existingUser.resetPasswordOtpExpiry) {
      return res.status(400).json({ success: false, msg: "Please request a new OTP" });
    }

    if(existingUser.resetPasswordOtpExpiry < Date.now()){
       return res.status(400).json({ success: false, msg: "Otp is expired send again" });
    }

    const otpCompare = await comparePassword(otp , existingUser.resetPasswordOtp);
    if(!otpCompare){
      return res.status(400).json({ success: false, msg: "Invalid Otp" });
    }
    existingUser.resetPasswordOtp = null;
    existingUser.resetPasswordOtpExpiry = null;
    existingUser.isResetPasswordOtpVerify = true;
    await existingUser.save()
   

    return res.status(200).json({ success: true, msg: "Otp is verified" });

  } catch (e) {
    return res.status(500).json({ success: false, msg: `Otp Verification Error: ${e.message}` });
  } 
};

const forgotSetPassword = async (req, res) => {
  
  try {
    const {password,email } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, msg: `Enter the Email or password` });
      }
    

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, msg: "password must be a 8 digit characters" });
    }
     
   
    const existingUser = await UserModel.findOne({email}).select("+password +isResetPasswordOtpVerify");


    if (!existingUser) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

      if ( !existingUser.isResetPasswordOtpVerify) {
      return res.status(400).json({ success: false, msg: "Otp is not verified please verify the otp" });
    }
    let comparePass = await comparePassword(password,existingUser.password)

    if(comparePass){
       return res.status(400).json({ success: false, msg: "Choose a diffrent password" });
    }

    const hash = await hashPassword(password);
    existingUser.password = hash;
    existingUser.isResetPasswordOtpVerify = false;
    existingUser.refreshToken = undefined;
    await existingUser.save()

     res.clearCookie("refreshToken");
   

    return res.status(200).json({ success: true, msg: "Password is set now do login " });

  } catch (e) {
    return res.status(500).json({ success: false, msg: `set-password: ${e.message}` });
  } 
};

const signUpVerification = async (req, res) => {
  try {
    console.log("I am called",req.body);
    
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, msg: "Email and OTP are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({ success: false, msg: "OTP must be 6 digits" });
    }

    const MAX_ATTEMPTS = 5;
    const LOCK_MINUTES = 10;

    const user = await UserModel.findOne({ email: normalizedEmail }).select(
      "+isVerified +verificationToken +verificationTokenExpiry +verificationAttempts +verificationLockUntil"
    );

    // same response for every failure path below, to avoid leaking state
    const invalid = () =>
      res.status(400).json({ success: false, msg: "Invalid or expired OTP" });

    if (!user) return invalid();

    if (user.isVerified) {
      return res.status(200).json({ success: true, msg: "Account already verified" });
    }

    // 1. lock currently active?
    if (user.verificationLockUntil && user.verificationLockUntil.getTime() > Date.now()) {
      const waitMs = user.verificationLockUntil.getTime() - Date.now();
      return res.status(429).json({
        success: false,
        msg: `Too many attempts. Try again in ${Math.ceil(waitMs / 60000)} minute(s).`,
      });
    }

    // 2. lock had expired -> clear it and reset counter
    if (user.verificationLockUntil) {
      user.verificationLockUntil = null;
      user.verificationAttempts = 0;
    }

    // 3. no active token at all
    if (!user.verificationToken || !user.verificationTokenExpiry) {
      return invalid();
    }

    // 4. token expired
    if (user.verificationTokenExpiry.getTime() < Date.now()) {
      user.verificationToken = null;
      user.verificationTokenExpiry = null;
      user.verificationAttempts = 0;
      user.verificationLockUntil = null;
      await user.save();
      return invalid();
    }

    // 5. compare OTP
    const isMatch = await comparePassword(String(otp), user.verificationToken);

    if (!isMatch) {
      user.verificationAttempts = (user.verificationAttempts ?? 0) + 1;

      if (user.verificationAttempts >= MAX_ATTEMPTS) {
        user.verificationLockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
        user.verificationAttempts = 0; // fresh counter once locked
      }

      await user.save();
      return invalid();
    }

    // success
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    user.verificationAttempts = 0;
    user.verificationLockUntil = null;
    await user.save();
    const data = user.toObject();
    delete data.verificationToken;
    delete data.verificationTokenExpiry;
    delete data.verificationAttempts;
    delete data.verificationLockUntil;

    return res.status(200).json({ success: true, msg: "SignUp Otp verification done...",user:data });
  } catch (e) {
    console.error("signUpVerification:", e);
    return res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};

const getRefreshToken = async (req, res) => {
  try {
    const RefreshToken = req.cookies.refreshToken; // fixed: cookies (plural)
    if (!RefreshToken) {
      return res.status(401).json({ success: false, msg: "Refresh token is missing" });
    }

    let verifyToken;
    try {
      verifyToken = jwt.verify(RefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, msg: "Invalid or expired refresh token" });
    }

    if (!verifyToken.id) {
      return res.status(401).json({ success: false, msg: "Invalid token payload" });
    }

    const checkUser = await UserModel.findById(verifyToken.id).select("+refreshToken");
    if (!checkUser || !checkUser.refreshToken) {
      return res.status(401).json({ success: false, msg: "User not found or no refresh token on record" });
    }

    const checkRefresh = await comparePassword(RefreshToken, checkUser.refreshToken);
    if (!checkRefresh) {
      return res.status(401).json({ success: false, msg: "Invalid refresh token" });
    }

    const { accessToken, refreshToken } = genrateToken({id:checkUser._id,role:checkUser.role});

    checkUser.refreshToken = await hashPassword(refreshToken);
    await checkUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, msg: "New access token generated successfully", accessToken });
  } catch (e) {
    return res.status(500).json({ success: false, msg: "Something went wrong" }); // don't leak e.message to client
  }
};

const getAllUsers = async(req,res)=>{
  try{
    const userId = req.user.id;
    if(!userId || !mongoose.isValidObjectId(userId)){
      return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }
    if(req.user.role !== 'admin'){
      return res.status(403).json({ success: false, msg: "Access denied" });
    }

    const users = await UserModel.find({role:'customer'});

    if(!users || users.length === 0){
      return res.status(404).json({ success: false, msg: "No users found" });
    }

    return res.status(200).json({ success: true, msg: "All Users found", users });
  }catch(e){
    return res.status(500).json({ success: false, msg: `Something went wrong ${e.message}` });
  }
}

const logOut = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, msg: "Invalid User Id" });
    }

    const user = await UserModel.findById(userId).select("loginAttempts lockUntil refreshToken");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User Not Found" });
    }

    user.refreshToken = null;
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({ success: true, msg: "Logout successful" });
  } catch (e) {
    console.error("Logout error:", e);
    return res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};
export {signIn,signUp,signUpVerification,forgotPassword,forgetVerifyOtp,forgotSetPassword,getRefreshToken,getAllUsers,logOut}