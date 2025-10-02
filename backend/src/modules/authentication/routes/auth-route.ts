import { Hono } from "hono";
import LoginController from "../controller/login-controller.ts";
import RegisterController from "../controller/register-controller.ts";
import UserController from "../controller/user-controller.ts";

const authRoute = new Hono();

authRoute.route("/login", LoginController);
authRoute.route("/register", RegisterController);
authRoute.route("/user", UserController);

export default authRoute;
