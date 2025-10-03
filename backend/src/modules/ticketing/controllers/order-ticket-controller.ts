import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import { createOrder } from "../services/order-ticket-service.ts";

const OrderTicketController = new Hono();

OrderTicketController.post("/", async (c) => {
  try {
    const requestBody = await c.req.json();
    console.log("Received order request:", requestBody);

    const {
      userUuid,
      ticketUuid,
      totalPasangger,
      totalPrice,
      typePasangger, // array: ["dewasa", "anak-anak", ...]
      seatNumbers, // array: ["A1", "A2", "A3", ...]
    } = requestBody;

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
  } catch (error) {
    console.error("Error in order ticket controller:", error);
    return c.json(ErrorsRes("Terjadi kesalahan internal server"), 500);
  }
});

export default OrderTicketController;
