import { Hono } from "hono";
import checkStatusController from "../controllers/check-status-controller";

const paymentRoute = new Hono()

paymentRoute.route("/check-status", checkStatusController)

export default paymentRoute