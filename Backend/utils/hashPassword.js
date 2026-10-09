import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
const hashPassword = async(password)=>{
    if (!password || typeof password !== 'string') {
    throw new Error("Invalid password provided for hashing");
  }
  try{
    
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword;
  }catch(e){
    console.log(`Error : hashpassword genrate failed ${e.message}`);
    throw new Error("Password hashing failed");
  }
}

const comparePassword = async(password,hashedPassword)=>{
  if(!password || typeof password !== "string" || !hashedPassword || typeof hashedPassword !== "string"){
    throw new Error("Invalid password or hashed password provided for comparison");
  }
  try{
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }catch(e){
    console.log(`Error : password comparison failed ${e.message}`);
    throw new Error("Password comparison failed");
  }
}

const genrateToken = ({id,role})=>{
  if(!id || !role){
    throw new Error("payload is empty for genratetoken")
  }
const accessToken =  jwt.sign({id,role}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN});
const refreshToken = jwt.sign({id,role}, process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN});
return {accessToken,refreshToken}
}

export {hashPassword,comparePassword,genrateToken}