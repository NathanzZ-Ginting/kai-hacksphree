import { db } from "../index.ts";
import { schedules } from "../schema/schedules.ts";
import { trains } from "../schema/trains.ts";
import { locations } from "../schema/locations.ts";

export async function seedSchedules() {
  // Get train and location UUIDs first
  const allTrains = await db.select().from(trains);
  const allLocations = await db.select().from(locations);

  const scheduleData = [
    {
      trainId: allTrains.find((train) => train.trainCode === "ARGO_BROMO")
        ?.uuid,
      originStationId: allLocations.find((loc) => loc.city === "Jakarta")?.uuid,
      destinationStationId: allLocations.find((loc) => loc.city === "Surabaya")
        ?.uuid,
      departureTime: new Date("2024-12-01T06:00:00Z"),
      arrivalTime: new Date("2024-12-01T14:30:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "ARGO_LAWU")?.uuid,
      originStationId: allLocations.find((loc) => loc.city === "Jakarta")?.uuid,
      destinationStationId: allLocations.find((loc) => loc.city === "Solo")
        ?.uuid,
      departureTime: new Date("2024-12-01T07:00:00Z"),
      arrivalTime: new Date("2024-12-01T14:00:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "TURANGGA")?.uuid,
      originStationId: allLocations.find((loc) => loc.city === "Jakarta")?.uuid,
      destinationStationId: allLocations.find((loc) => loc.city === "Surabaya")
        ?.uuid,
      departureTime: new Date("2024-12-01T08:00:00Z"),
      arrivalTime: new Date("2024-12-01T17:00:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "ARGO_PARAHYANGAN")
        ?.uuid,
      originStationId: allLocations.find((loc) => loc.city === "Jakarta")?.uuid,
      destinationStationId: allLocations.find((loc) => loc.city === "Bandung")
        ?.uuid,
      departureTime: new Date("2024-12-01T06:30:00Z"),
      arrivalTime: new Date("2024-12-01T09:30:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "BENGAWAN")?.uuid,
      originStationId: allLocations.find((loc) => loc.city === "Jakarta")?.uuid,
      destinationStationId: allLocations.find((loc) => loc.city === "Solo")
        ?.uuid,
      departureTime: new Date("2024-12-01T20:00:00Z"),
      arrivalTime: new Date("2024-12-02T06:00:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "GAJAYANA")?.uuid,
      originStationId: allLocations.find((loc) => loc.city === "Jakarta")?.uuid,
      destinationStationId: allLocations.find((loc) => loc.city === "Malang")
        ?.uuid,
      departureTime: new Date("2024-12-01T18:00:00Z"),
      arrivalTime: new Date("2024-12-02T06:30:00Z"),
    },
  ];

  await db
    .insert(schedules)
    .values(
      scheduleData.filter(
        (s) => s.trainId && s.originStationId && s.destinationStationId
      )
    );
}
