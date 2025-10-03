import { Hono } from "hono";
import categoryController from "../controllers/category-controller.ts";
import locationController from "../controllers/location-controller.ts";
import scheduleController from "../controllers/schedules-controller.ts";
import stationController from "../controllers/station-controller.ts";
import ticketController from "../controllers/ticket-controller.ts";
import trainController from "../controllers/train-schedules.ts";
import trainSeatController from "../controllers/train-seats-controller.ts";
import orderTicketController from "../controllers/order-ticket-controller.ts";

const masterDataRoute = new Hono()

masterDataRoute.route("/categories", categoryController)
masterDataRoute.route("/locations", locationController)
masterDataRoute.route("/schedules", scheduleController)
masterDataRoute.route("/station", stationController)
masterDataRoute.route("/ticket", ticketController)
masterDataRoute.route("/train", trainController)
masterDataRoute.route("/train-seat", trainSeatController)
masterDataRoute.route("/order-ticket", orderTicketController)

export default masterDataRoute