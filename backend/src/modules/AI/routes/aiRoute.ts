import { Hono } from "hono";
import aiController from "../controllers/ai-controller";

const aiRoute = new Hono()

aiRoute.route("/generate-text", aiController)

export default aiRoute