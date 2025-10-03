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
    const captchaToken = body.captchaToken;

    if (!captchaToken) {
      return c.json({ success: false, message: "Captcha token missing" }, 400);
    }

    const isValid = await verifyCaptcha(captchaToken);
    if (!isValid) {
      return c.json({ success: false, message: "Captcha verification failed" }, 400);
    }

    // Allow the next handler to process the request with the original body
    await next();
  } catch (error) {
    console.error("Captcha middleware error:", error);
    return c.json({ success: false, message: "Error processing request" }, 500);
  }
};

authRoute.route("/login", LoginController.use("*", captchaMiddleware));
authRoute.route("/register", RegisterController.use("*", captchaMiddleware));
authRoute.route("/user", UserController);

export default authRoute;