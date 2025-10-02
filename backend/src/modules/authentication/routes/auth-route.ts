import { Hono } from "hono";
import LoginController from "../controller/login-controller.ts";

const authRoute = new Hono()

authRoute.route("/login", LoginController)

export default authRoute