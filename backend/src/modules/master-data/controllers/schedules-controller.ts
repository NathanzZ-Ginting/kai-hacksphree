import { Hono } from "hono";
import {
  fetchCategory,
  fetchCategoryByUuid,
} from "../services/category-service.ts";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import {
  fetchSchedule,
  fetchScheduleByStation,
  fetchScheduleByUuid,
} from "../services/schedules-service.ts";

const scheduleController = new Hono();

scheduleController.get("/", async (c) => {
  try {
    const result = await fetchSchedule();

    if (!result.success) {
      return c.json(ErrorsRes(result.message), 500);
    }

    return c.json(SuccessRes(result.message, result.data));
  } catch (error: unknown) {
    return c.json(
      ErrorsRes("Unknown error occurred, please try again", error!),
      500
    );
  }
});

scheduleController.get("/:uuid", async (c) => {
  if (!c.req.param("uuid")) {
    return c.json(SuccessRes("Required UUID"), 400);
  }

  try {
    const uuid = c.req.param("uuid");
    const result = await fetchScheduleByUuid(uuid);

    if (!result.success) {
      return c.json(ErrorsRes(result.message), 500);
    }

    return c.json(SuccessRes(result.message, result.data));
  } catch (error) {
    return c.json(
      ErrorsRes("Unknown error occurred, please try again", error!),
      500
    );
  }
});

scheduleController.get(":uuidOrigin/:uuidDestination", async (c) => {
  try {
    // Get query parameters
    const uuidOrigin = await c.req.param("uuidOrigin")
    const uuidDestination = await c.req.param("uuidDestination")

    if (!uuidDestination || !uuidOrigin) {
      return c.json(
        ErrorsRes("Masukan stasiun asal dan stasiun tujuan terlebih dahulu!"),
        400
      );
    }

    // Validate that origin and destination are different
    if (uuidOrigin === uuidDestination) {
      return c.json(
        ErrorsRes("Stasiun asal dan stasiun tujuan tidak boleh sama!"),
        400
      );
    }

    const result = await fetchScheduleByStation(uuidOrigin, uuidDestination);

    if (!result.success) {
      console.log(`Controller: Service returned error: ${result.message}`);
      return c.json(ErrorsRes(result.message), 404);
    }

    return c.json(SuccessRes(result.message, result.data), 200);
  } catch (error) {
    console.error("Error in /station endpoint:", error);
    return c.json(
      ErrorsRes("Terjadi kesalahan saat mencari jadwal kereta!", {
        error: error instanceof Error ? error.message : String(error),
      }),
      500
    );
  }
});

export default scheduleController;
