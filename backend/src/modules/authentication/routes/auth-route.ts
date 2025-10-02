import { Hono } from "hono";
import LoginController from "../controller/login-controller.ts";
import RegisterController from "../controller/register-controller.ts";

const authRoute = new Hono()

authRoute.route("/login", LoginController)
authRoute.route("/register", RegisterController)

export default authRoute