import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // aapka gmail address
    pass: process.env.EMAIL_APP_PASSWORD  // Gmail App Password (normal password nahi!)
  }
});


const sendEmail = async ({ to, subject, html }) => {
  try {
    
    const info = await transporter.sendMail({
      from: `"MealMate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (e) {
    console.log(`Email sending failed: ${e.message}`);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;

// templates/emailTemplates.js

export const otpTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
    <h2>Your OTP Code</h2>
    <p>Use the following OTP to proceed. This code is valid for 10 minutes.</p>
    <h1 style="letter-spacing: 5px; color: #333;">${otp}</h1>
    <p>If you did not request this, please ignore this email.</p>
  </div>
`;

export const verificationTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
    <h2>Verify Your Account</h2>
    <p>Use the following OTP to verify your MealMate account. This code is valid for 10 minutes.</p>
    <h1 style="letter-spacing: 5px; color: #333;">${otp}</h1>
    <p>If you did not create an account, please ignore this email.</p>
  </div>
`;