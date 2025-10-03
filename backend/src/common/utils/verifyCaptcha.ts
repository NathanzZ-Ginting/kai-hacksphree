// src/utils/verifyCaptcha.ts
import axios from "axios";

export const verifyCaptcha = async (token: string): Promise<boolean> => {
  try {
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
    return data.success && data.score >= 0.5; // score 0.0 - 1.0
  } catch (error) {
    console.error("Captcha verification error:", error);
    return false;
  }
};