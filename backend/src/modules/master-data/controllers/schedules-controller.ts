import { Hono } from "hono";
import { fetchCategory, fetchCategoryByUuid } from "../services/category-service.ts";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import { fetchSchedule, fetchScheduleByUuid } from "../services/schedules-service.ts";

const scheduleController = new Hono()

scheduleController.get("/", async (c) => {
  try{
    const result = await fetchSchedule()

    if(!result.success) {
      return c.json(ErrorsRes(result.message), 500)
    }

    return c.json(SuccessRes(result.message, result.data))
  }catch(error: unknown) {
    return c.json(
      ErrorsRes("Unknown error occurred, please try again", error!),
      500
    );
  }
})

scheduleController.get("/:uuid", async (c) => {

  if(!c.req.param("uuid")){
    return c.json(SuccessRes("Required UUID"), 400)
  }

  try{
    const uuid = c.req.param("uuid")
    const result = await fetchScheduleByUuid(uuid)

    if(!result.success) {
      return c.json(ErrorsRes(result.message), 500)
    }

    return c.json(SuccessRes(result.message, result.data))
  }catch(error) {
    return c.json(
      ErrorsRes("Unknown error occurred, please try again", error!),
      500
    );
  }
})

export default scheduleController