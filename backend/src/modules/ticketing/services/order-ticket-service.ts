// import midtransClient from "midtrans-client";
// import "dotenv/config";
// import { createOrderTicket } from "../../../common/repositories/order-tickets-repository.ts";
// import { randomInt } from "crypto";
// import { getUserByUuid } from "../../../common/repositories/users-repository.ts";
// import { createOrderDetail } from "../../../common/repositories/order-details-repository.ts";

// interface orderService {
//   success: boolean;
//   message: string;
//   data?: object;
//   errors?: object;
// }

// export const createOrder = async (
//   userUuid: string,
//   ticketUuid: string,
//   totalPasangger: number,
//   totalPrice: number
// ): Promise<orderService> => {
//   const serverKey = process.env.SERVER_KEY;
//   const clientKey = process.env.CLIENT_KEY;

//   if (!serverKey || !clientKey) {
//     return {
//       success: false,
//       message: "Tidak dapat menghubungkan ke midtrans!",
//     };
//   }

//   let snap = new midtransClient.Snap({
//     isProduction: false,
//     serverKey: serverKey,
//     clientKey: clientKey,
//   });

//   const now = new Date();
//   var invcNumber = "ord-" + now.getDate() + randomInt(99999);

//   const user = await getUserByUuid(userUuid)

//   var data = {
//     userId: user.uuid,
//     invoiceNumber: invcNumber,
//     status: "pending",
//     numberOfPassanger: totalPasangger,
//     orderDate: now, 
//     totalPrice: totalPrice,
//   };

//   try {
//     var order = await createOrderTicket(data);

//     if (!order) {
//       return {
//         success: false,
//         message: "Gagal membuat order ticket",
//       };
//     }

//     for(let i = 0; i < data.numberOfPassanger; i++){

//          var dataDetail = {
//            orderId: order.uuid,
//            ticketId: ticketUuid,
//            status: "pending",
//            numberOfPassanger: totalPasangger,
//            orderDate: now,
//            totalPrice: totalPrice,
//          };

//         var details = await createOrderDetail()
//     }

//     const parameter = {
//       transaction_details: {
//         order_id: order.invoiceNumber,
//         gross_amount: totalPrice,
//       },
//       customer_details: {
//         first_name: user.name,
//         email: user.email
//       }
//     };

//     const transaction = await snap.createTransaction(parameter);

//     return {
//       success: true,
//       message: "Order berhasil dibuat",
//       data: {
//         snapRedirectUrl: transaction.redirect_url,
//       },
//     };
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return {
//       success: false,
//       message: "Terjadi kesalahan saat membuat order",
//       errors:
//         error instanceof Error
//           ? { message: error.message }
//           : { message: "Unknown error" },
//     };
//   }
// };
