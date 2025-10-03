// src/routes/auth.route.ts
import { Hono } from "hono";
import LoginController from "../controller/login-controller.ts";
import RegisterController from "../controller/register-controller.ts";
import UserController from "../controller/user-controller.ts";
import { verifyCaptcha } from "../../../common/utils/verifyCaptcha.ts";

const authRoute = new Hono();

// Middleware verify captcha
const captchaMiddleware = async (c: any, next: any) => {
  try {
    // Clone the request to avoid consuming the body
    const clonedRequest = c.req.clone();
    const body = await clonedRequest.json();
    
    console.log("Request body:", body);
    const captchaToken = body.captchaToken;

    if (!captchaToken) {
      console.error("Captcha token missing in request:", body);
      return c.json({ success: false, message: "Captcha token missing" }, 400);
    }

    console.log("Captcha token received:", captchaToken.substring(0, 20) + "...");
    
    const isValid = await verifyCaptcha(captchaToken);
    console.log("Captcha validation result:", isValid);
    
    if (!isValid) {
      return c.json({ success: false, message: "Captcha verification failed" }, 400);
    }

    // Allow the next handler to process the request with the original body
    await next();
  } catch (error) {
    console.error("Captcha middleware error:", error);
    return c.json({ success: false, message: `Error processing request: ${error instanceof Error ? error.message : String(error)}` }, 500);
  }
};

authRoute.route("/login", LoginController.use("*", captchaMiddleware));
authRoute.route("/register", RegisterController.use("*", captchaMiddleware));
authRoute.route("/user", UserController);

export default authRoute;