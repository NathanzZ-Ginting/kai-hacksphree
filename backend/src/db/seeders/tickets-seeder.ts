import { db } from "../index";
import { tickets } from "../schema/tickets";
import { schedules } from "../schema/schedules";

export async function seedTickets() {
  // Get schedule UUIDs first
  const allSchedules = await db.select().from(schedules);

  const ticketData = [
    {
      scheduleId: allSchedules[0]?.uuid, // Argo Bromo Jakarta-Surabaya
      price: 850000,
      tax: 85000,
    },
    {
      scheduleId: allSchedules[1]?.uuid, // Argo Lawu Jakarta-Solo
      price: 750000,
      tax: 75000,
    },
    {
      scheduleId: allSchedules[2]?.uuid, // Turangga Jakarta-Surabaya
      price: 550000,
      tax: 55000,
    },
    {
      scheduleId: allSchedules[3]?.uuid, // Argo Parahyangan Jakarta-Bandung
      price: 200000,
      tax: 20000,
    },
    {
      scheduleId: allSchedules[4]?.uuid, // Bengawan Jakarta-Solo
      price: 350000,
      tax: 35000,
    },
    {
      scheduleId: allSchedules[5]?.uuid, // Gajayana Jakarta-Malang
      price: 900000,
      tax: 90000,
    },
  ];

  await db.insert(tickets).values(ticketData.filter((t) => t.scheduleId));
}
