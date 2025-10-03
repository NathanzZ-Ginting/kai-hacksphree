import { Hono } from "hono";
import { fetchCategory, fetchCategoryByUuid } from "../services/category-service";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response";
import { fetchTicket, fetchTicketByUuid } from "../services/ticket-service";

const ticketController = new Hono()

ticketController.get("/", async (c) => {
  try{
    const result = await fetchTicket()

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

ticketController.get("/:uuid", async (c) => {

  if(!c.req.param("uuid")){
    return c.json(SuccessRes("Required UUID"), 400)
  }

  try{
    const uuid = c.req.param("uuid")
    const result = await fetchTicketByUuid(uuid)

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

export default ticketController