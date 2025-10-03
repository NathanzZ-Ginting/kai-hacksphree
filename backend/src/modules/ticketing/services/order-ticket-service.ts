import midtransClient from "midtrans-client";
import "dotenv/config";
import { createOrderTicket } from "../../../common/repositories/order-tickets-repository.ts";
import { randomInt } from "crypto";
import { getUserByUuid } from "../../../common/repositories/users-repository.ts";
import { createOrderDetail } from "../../../common/repositories/order-details-repository.ts";

interface OrderService {
  success: boolean;
  message: string;
  data?: object;
  errors?: object;
}

export const createOrder = async (
  userUuid: string,
  ticketUuid: string,
  totalPasangger: number,
  totalPrice: number,
  typePasangger: ("dewasa" | "anak-anak")[],
  seatNumbers: string[]
): Promise<OrderService> => {
  const serverKey = process.env.SERVER_KEY;
  const clientKey = process.env.CLIENT_KEY;

  if (!serverKey || !clientKey) {
    return {
      success: false,
      message: "Tidak dapat menghubungkan ke Midtrans!",
    };
  }

  // Validasi panjang array
  if (
    typePasangger.length !== totalPasangger ||
    seatNumbers.length !== totalPasangger
  ) {
    return {
      success: false,
      message:
        "Jumlah typePasangger atau seatNumbers tidak sesuai totalPasangger",
    };
  }

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey,
    clientKey,
  });

  const now = new Date();
  const invcNumber = "KAI-" + now + randomInt(99999);

  const user = await getUserByUuid(userUuid);
  if (!user) {
    return { success: false, message: "User tidak ditemukan" };
  }

  const orderData = {
    userId: user.uuid,
    invoiceNumber: invcNumber,
    status: "pending",
    numberOfPassanger: totalPasangger,
    orderDate: now,
    totalPrice: totalPrice,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const order = await createOrderTicket(orderData);

    if (!order) {
      return { success: false, message: "Gagal membuat order ticket" };
    }

    // Loop untuk membuat order_details per penumpang
    for (let i = 0; i < totalPasangger; i++) {
      const dataDetail = {
        orderId: order.uuid,
        ticketId: ticketUuid,
        passengerType: typePasangger[i] as "dewasa" | "anak-anak",
        seatNumber: seatNumbers[i] as string,
        createdAt: now,
        updatedAt: now,
      };

      await createOrderDetail(dataDetail);
    }

    // Prepare Midtrans transaction
    const parameter = {
      transaction_details: {
        order_id: order.invoiceNumber,
        gross_amount: totalPrice,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return {
      success: true,
      message: "Order berhasil dibuat",
      data: {
        snapRedirectUrl: transaction.redirect_url,
      },
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat order",
      errors:
        error instanceof Error
          ? { message: error.message }
          : { message: "Unknown error" },
    };
  }
};
