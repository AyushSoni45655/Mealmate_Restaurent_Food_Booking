import dotenv from 'dotenv';
dotenv.config();




const sendEmail = async ({ to, subject, html }) => {
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "MealMate", email: process.env.EMAIL_USER },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Brevo API error");
    }

    console.log("Email sent:", data.messageId);
    return data;
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