import { Hono } from "hono";
import { checkStatusService } from "../services/check-status-service";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response";

const checkStatusController = new Hono();

checkStatusController.get("/:orderId", async (c) => {
  try {
    // Ambil orderId dari URL parameter
    const orderId = c.req.param("orderId");

    if (!orderId) {
      return c.json(ErrorsRes("Order ID is required"), 400);
    }

    const result = await checkStatusService(orderId);

    if (!result.success) {
      return c.json(ErrorsRes(result.message, result.errors), 400);
    }

    return c.json(SuccessRes(result.message, result.data), 200);
  } catch (error) {
    console.error("Controller error:", error);
    return c.json(
      ErrorsRes("Internal server error", {
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      500
    );
  }
});

// Alternative: GET dengan query parameter
checkStatusController.get("/", async (c) => {
  try {
    // Ambil orderId dari query parameter: ?orderId=xxx
    const orderId = c.req.query("orderId");

    if (!orderId) {
      return c.json(ErrorsRes("Order ID is required as query parameter"), 400);
    }

    const result = await checkStatusService(orderId);

    if (!result.success) {
      return c.json(ErrorsRes(result.message, result.errors), 400);
    }

    return c.json(SuccessRes(result.message, result.data), 200);
  } catch (error) {
    console.error("Controller error:", error);
    return c.json(
      ErrorsRes("Internal server error", {
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      500
    );
  }
});

export default checkStatusController;
