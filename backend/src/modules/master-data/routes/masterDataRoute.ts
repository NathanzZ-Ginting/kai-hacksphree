import { Hono } from "hono";
import categoryController from "../controllers/category-controller";
import locationController from "../controllers/location-controller";
import scheduleController from "../controllers/schedules-controller";
import stationController from "../controllers/station-controller";
import ticketController from "../controllers/ticket-controller";
import trainController from "../controllers/train-schedules";
import trainSeatController from "../controllers/train-seats-controller";
import orderTicketController from "../controllers/order-ticket-controller";

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