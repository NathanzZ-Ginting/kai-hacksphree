import midtransClient from "midtrans-client";
import { createPayment } from "../../../common/repositories/payments-repository.ts";

interface checkResult {
  success: boolean;
  message: string;
  data?: object;
  errors?: object;
}

const apiClient = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.SERVER_KEY!,
  clientKey: process.env.CLIENT_KEY!,
});

export const checkStatusService = async (
  orderId: string
): Promise<checkResult> => {
  try {
    if (!orderId) {
      return {
        success: false,
        message: "Order ID tidak boleh kosong",
        errors: { message: "Missing orderId parameter" },
      };
    }

    const res = await (apiClient as any).transaction.status(orderId);

    if (!res) {
      return {
        success: false,
        message: "Tidak ada response dari Midtrans",
        errors: { message: "Empty response from Midtrans" },
      };
    }

    var data = {
      orderId: res.transaction_id,
      invoicePayment: res.order_id,
      amount: res.gross_amount,
      status: res.transaction_status,
      method: res.payment_type,
    };

    await createPayment(data)

    return {
      success: true,
      message: "Status berhasil diambil!",
      data: {
        transaction_status: res.transaction_status,
        transaction_id: res.transaction_id,
        order_id: res.order_id,
        payment_type: res.payment_type,
        transaction_time: res.transaction_time,
        gross_amount: res.gross_amount,
        fraud_status: res.fraud_status,
        status_code: res.status_code,
        status_message: res.status_message,
      },
    };
  } catch (error) {
    console.error("Error checking transaction status:", error);

    // Handle specific Midtrans errors
    if (error && typeof error === "object" && "status_code" in error) {
      return {
        success: false,
        message: `Midtrans Error: ${
          (error as any).status_message || "Unknown error"
        }`,
        errors: {
          status_code: (error as any).status_code,
          status_message: (error as any).status_message,
        },
      };
    }

    return {
      success: false,
      message: "Gagal mengambil status transaksi",
      errors:
        error instanceof Error
          ? { message: error.message }
          : { message: "Unknown error" },
    };
  }
};
