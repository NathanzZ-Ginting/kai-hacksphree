// import { Hono } from "hono";
// import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
// import { createOrder } from "../services/order-ticket-service.ts";

// const OrderTicketController = new Hono()

// OrderTicketController.post("/", async (c) => {
//     const {userUuid, totalPrice} = await c.req.json()

//     if(!userUuid || !totalPrice){
//         return c.json(ErrorsRes("Mohon masukan data telebih dahulu!"), 400)
//     }

//     const result = await createOrder(userUuid, totalPrice)

//     if(!result.success) {
//         return c.json(ErrorsRes(result.message), 500)
//     }

//     return c.json(SuccessRes(result.message, result.data), 201)
// })

// export default OrderTicketController