import { Hono } from "hono";
import { fetchCategory, fetchCategoryByUuid } from "../services/category-service";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response";
import { fetchLocation, fetchLocationByCity, fetchLocationByUuid } from "../services/location-service";

const locationController = new Hono()

locationController.get("/", async (c) => {
  try{
    const result = await fetchLocation()

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

locationController.get("/:uuid", async (c) => {

  if(!c.req.param("uuid")){
    return c.json(SuccessRes("Required UUID"), 400)
  }

  try{
    const uuid = c.req.param("uuid")
    const result = await fetchLocationByUuid(uuid)

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


locationController.get("/:city", async (c) => {
  if (!c.req.param("city")) {
    return c.json(SuccessRes("Required city"), 400);
  }

  try {
    const city = c.req.param("city");
    const result = await fetchLocationByCity(city);

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

export default locationController