import { Ticket } from "../../../common/interface/tickets-interface.ts";
import { createTicket, getAllTickets, getTicketByUuid } from "../../../common/repositories/tickets-repository.ts";

interface ticketResult {
  success: boolean;
  message: string;
  data?: object;
  errors?: object;
}

const fetchTicket = async (): Promise<ticketResult> => {
  try {
    const collection = await getAllTickets();

    if (collection.length < 1) {
      return {
        success: false,
        message: "Data tidak ada!",
      } as ticketResult;
    }

    return {
      success: true,
      message: "Data ditemukan!",
      data: collection as Ticket[],
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const fetchTicketByUuid = async (uuid: string): Promise<ticketResult> => {
  try {
    const schedule = await getTicketByUuid(uuid);

    if (!schedule) {
      return {
        success: false,
        message: `Ticket dengan uuid ${uuid} tidak ditemukan!`,
      };
    }

    return {
      success: true,
      message: "Ticket ditemukan!",
      data: schedule as Ticket,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const addTicket = async (ticket: Ticket): Promise<ticketResult> => {
  try {
    const newTicket = await createTicket(ticket);

    return {
      success: true,
      message: "Ticket berhasil dibuat!",
      data: newTicket,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

export {fetchTicket, fetchTicketByUuid, addTicket}