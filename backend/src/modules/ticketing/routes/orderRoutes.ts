import { Hono } from "hono";
import OrderTicketController from "../controllers/order-ticket-controller";

const orderRoute = new Hono()

orderRoute.route("/order-ticket", OrderTicketController);

export default orderRoute