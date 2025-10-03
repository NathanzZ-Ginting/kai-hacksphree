import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import { searchOrderTicketByInvoice } from "../services/order-ticket-service.ts";

const orderTicketController = new Hono()

orderTicketController.get("/:invoice", async (c) => {
    const param = c.req.param("invoice")

    if(!param) {
        return c.json(ErrorsRes("Isi nomor invoice terlebih dahulu!"), 400)
    }

    const result = await searchOrderTicketByInvoice(param)

    if(!result.success){
        return c.json(ErrorsRes(result.message), 500)
    }

    return c.json(SuccessRes(result.message, result.data))
})

export default orderTicketController