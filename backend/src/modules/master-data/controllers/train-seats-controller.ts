import { Hono } from "hono";
import { fetchCategory, fetchCategoryByUuid } from "../services/category-service.ts";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import { fetchTrainSeats, fetchTrainSeatsByUuid } from "../services/train-seats-service.ts";

const trainSeatController = new Hono()

trainSeatController.get("/", async (c) => {
  try{
    const result = await fetchTrainSeats()

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

trainSeatController.get("/:uuid", async (c) => {

  if(!c.req.param("uuid")){
    return c.json(SuccessRes("Required UUID"), 400)
  }

  try{
    const uuid = c.req.param("uuid")
    const result = await fetchTrainSeatsByUuid(uuid)

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

export default trainSeatController