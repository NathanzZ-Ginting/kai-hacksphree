import { eq, desc } from "drizzle-orm";
import { db } from "../../../db";
import { orderTickets } from "../../../db/schema/order-tickets";
import { orderDetails } from "../../../db/schema/order-details";
import { tickets } from "../../../db/schema/tickets";
import { trains } from "../../../db/schema/trains";
import { stations } from "../../../db/schema/stations";
import { schedules } from "../../../db/schema/schedules";

export const getTransactionHistory = async (userId: string) => {
  try {
    const transactions = await db
      .select({
        // Order info
        orderId: orderTickets.uuid,
        orderNumber: orderTickets.invoiceNumber,
        status: orderTickets.status,
        orderDate: orderTickets.orderDate,
        totalPrice: orderTickets.totalPrice,
        numberOfPassenger: orderTickets.numberOfPassanger,
        
        // Ticket info
        ticketId: tickets.uuid,
        ticketPrice: tickets.price,
        
        // Train info
        trainName: trains.name,
        
        // Schedule info
        departureTime: schedules.departureTime,
        arrivalTime: schedules.arrivalTime,
        
        // Seat info
        seatNumber: orderDetails.seatNumber,
        passengerType: orderDetails.passengerType,
      })
      .from(orderTickets)
      .leftJoin(orderDetails, eq(orderTickets.uuid, orderDetails.orderId))
      .leftJoin(tickets, eq(orderDetails.ticketId, tickets.uuid))
      .leftJoin(schedules, eq(tickets.scheduleId, schedules.uuid))
      .leftJoin(trains, eq(schedules.trainId, trains.uuid))
      .where(eq(orderTickets.userId, userId))
      .orderBy(desc(orderTickets.orderDate));

    // Transform to match frontend interface
    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.orderId,
      orderNumber: transaction.orderNumber || "KAI-" + Date.now(),
      ticketType: "Eksekutif", // Default since not in schema
      route: "Jakarta Gambir → Yogyakarta Tugu", // Default route
      departure: "Jakarta Gambir",
      arrival: "Yogyakarta Tugu", 
      departureTime: transaction.departureTime 
        ? new Date(transaction.departureTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) 
        : "07:00",
      arrivalTime: transaction.arrivalTime 
        ? new Date(transaction.arrivalTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) 
        : "15:30",
      price: transaction.totalPrice || 0,
      status: mapOrderStatus(transaction.status),
      createdAt: transaction.orderDate ? transaction.orderDate.toISOString() : new Date().toISOString(),
      seatNumber: transaction.seatNumber || "1A",
      trainName: transaction.trainName || "KAI Express",
      passangerName: transaction.passengerType || "Dewasa",
    }));

    // Remove duplicates and filter out null orders
    const uniqueTransactions = formattedTransactions.filter((transaction, index, self) => 
      transaction.id && self.findIndex(t => t.id === transaction.id) === index
    );

    return {
      success: true,
      message: "Riwayat transaksi berhasil diambil",
      data: uniqueTransactions,
    };
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return {
      success: false,
      message: "Gagal mengambil riwayat transaksi",
      data: [],
    };
  }
};

// Map database status to frontend status
const mapOrderStatus = (dbStatus: string | null): 'pending' | 'confirmed' | 'cancelled' | 'completed' => {
  switch (dbStatus?.toLowerCase()) {
    case 'paid':
    case 'settlement':
    case 'capture':
      return 'completed';
    case 'pending':
      return 'pending';
    case 'cancel':
    case 'deny':
    case 'expire':
      return 'cancelled';
    case 'authorize':
      return 'confirmed';
    default:
      return 'pending';
  }
};
