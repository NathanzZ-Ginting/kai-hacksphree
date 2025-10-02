import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import { createOrder } from "../services/order-ticket-service.ts";

const OrderTicketController = new Hono();

OrderTicketController.post("/", async (c) => {
  const {
    userUuid,
    ticketUuid,
    totalPasangger,
    totalPrice,
    typePasangger, // array: ["dewasa", "anak-anak", ...]
    seatNumbers, // array: ["A1", "A2", "A3", ...]
  } = await c.req.json();

  if (!userUuid || !totalPrice) {
    return c.json(ErrorsRes("Mohon masukan data terlebih dahulu!"), 400);
  }

  // Validasi dasar array
  if (
    !Array.isArray(typePasangger) ||
    !Array.isArray(seatNumbers) ||
    typePasangger.length !== totalPasangger ||
    seatNumbers.length !== totalPasangger
  ) {
    return c.json(
      ErrorsRes(
        "Jumlah typePasangger atau seatNumbers tidak sesuai totalPasangger"
      ),
      400
    );
  }

  const result = await createOrder(
    userUuid,
    ticketUuid,
    totalPasangger,
    totalPrice,
    typePasangger,
    seatNumbers
  );

  if (!result.success) {
    return c.json(ErrorsRes(result.message), 500);
  }

  return c.json(SuccessRes(result.message, result.data), 201);
});

export default OrderTicketController;