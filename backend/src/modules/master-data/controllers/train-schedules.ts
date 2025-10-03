import { Hono } from "hono";
import { fetchCategory, fetchCategoryByUuid } from "../services/category-service";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response";
import { fetchTrain, fetchTrainByUuid } from "../services/train-schedules";

const trainController = new Hono()

trainController.get("/", async (c) => {
  try{
    const result = await fetchTrain()

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

trainController.get("/:uuid", async (c) => {

  if(!c.req.param("uuid")){
    return c.json(SuccessRes("Required UUID"), 400)
  }

  try{
    const uuid = c.req.param("uuid")
    const result = await fetchTrainByUuid(uuid)

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

export default trainController