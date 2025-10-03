import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response";
import { fetchSeatByTrainUuid, fetchTrainSeats } from "../services/train-seats-service";

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

trainSeatController.get("/:trainId", async (c) => {
  if (!c.req.param("trainId")) {
    return c.json(ErrorsRes("Required TrainID"), 400);
  }

  try {
    const uuid = c.req.param("trainId");
    const result = await fetchSeatByTrainUuid(uuid);

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
})

export default trainSeatController