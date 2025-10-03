// src/utils/verifyCaptcha.ts
import axios from "axios";

export const verifyCaptcha = async (token: string): Promise<boolean> => {
  try {
    // For debugging
    console.log("reCAPTCHA token received:", token.substring(0, 20) + "...");
    console.log("reCAPTCHA secret key:", process.env.RECAPTCHA_SECRET_KEY);
    
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
    
    if (isDevelopment && (!process.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY.startsWith("6"))) {
      console.log("Development mode: bypassing reCAPTCHA verification");
      return true; // Skip verification in development
    }
    
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // taro di .env backend
    if (!secretKey) throw new Error("Missing reCAPTCHA secret key");

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret: secretKey,
        response: token,
      })
    );

    const data = response.data;
    console.log("reCAPTCHA verification response:", data);
    return data.success; // for v2 checkbox, we only need to check success
  } catch (error) {
    console.error("Captcha verification error:", error);
    return false;
  }
};