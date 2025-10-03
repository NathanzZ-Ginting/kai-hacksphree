import { OrderTicket } from "../../../common/interface/order-tickets-interface.ts";
import { searchOrderTicketsByInvoiceNumber } from "../../../common/repositories/order-tickets-repository.ts";

const searchOrderTicketByInvoice = async (invoice: string) => {
    try {
        const orderTicket = await searchOrderTicketsByInvoiceNumber(invoice);
        
        if (!orderTicket || orderTicket.length < 1) {
          return {
            success: false,
            message: `Order ticket dengan invoice number ${invoice} tidak ditemukan!`,
          };
        }
    
        return {
          success: true,
          message: "Ticket ditemukan!",
          data: orderTicket as OrderTicket[],
        };
      } catch (error) {
        return {
          success: false,
          message: "Terjadi kesalahan!",
          errors: { [0]: error },
        };
      }
}

export {searchOrderTicketByInvoice}