import { db } from "../index.ts";
import { schedules } from "../schema/schedules.ts";
import { trains } from "../schema/trains.ts";
import { stations } from "../schema/stations.ts";

export async function seedSchedules() {
  console.log("🚂 Seeding schedules...");

  // Get train and station UUIDs first
  const allTrains = await db.select().from(trains);
  const allStations = await db.select().from(stations);

  const scheduleData = [
    {
      trainId: allTrains.find((train) => train.trainCode === "ARGO_BROMO")
        ?.uuid,
      originStationId: allStations.find(
        (station) => station.name === "Stasiun Gambir"
      )?.uuid,
      destinationStationId: allStations.find(
        (station) => station.name === "Stasiun Gubeng"
      )?.uuid,
      departureTime: new Date("2025-12-01T06:00:00Z"),
      arrivalTime: new Date("2025-12-01T14:30:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "ARGO_LAWU")?.uuid,
      originStationId: allStations.find(
        (station) => station.name === "Stasiun Gambir"
      )?.uuid,
      destinationStationId: allStations.find(
        (station) => station.name === "Stasiun Solo Balapan"
      )?.uuid,
      departureTime: new Date("2025-12-01T07:00:00Z"),
      arrivalTime: new Date("2025-12-01T14:00:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "TURANGGA")?.uuid,
      originStationId: allStations.find(
        (station) => station.name === "Stasiun Gambir"
      )?.uuid,
      destinationStationId: allStations.find(
        (station) => station.name === "Stasiun Gubeng"
      )?.uuid,
      departureTime: new Date("2025-12-01T08:00:00Z"),
      arrivalTime: new Date("2025-12-01T17:00:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "ARGO_PARAHYANGAN")
        ?.uuid,
      originStationId: allStations.find(
        (station) => station.name === "Stasiun Gambir"
      )?.uuid,
      destinationStationId: allStations.find(
        (station) => station.name === "Stasiun Bandung"
      )?.uuid,
      departureTime: new Date("2025-12-01T06:30:00Z"),
      arrivalTime: new Date("2025-12-01T09:30:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "BENGAWAN")?.uuid,
      originStationId: allStations.find(
        (station) => station.name === "Stasiun Gambir"
      )?.uuid,
      destinationStationId: allStations.find(
        (station) => station.name === "Stasiun Solo Balapan"
      )?.uuid,
      departureTime: new Date("2025-12-01T20:00:00Z"),
      arrivalTime: new Date("2025-12-02T06:00:00Z"),
    },
    {
      trainId: allTrains.find((train) => train.trainCode === "GAJAYANA")?.uuid,
      originStationId: allStations.find(
        (station) => station.name === "Stasiun Gambir"
      )?.uuid,
      destinationStationId: allStations.find(
        (station) => station.name === "Stasiun Malang"
      )?.uuid,
      departureTime: new Date("2025-12-01T18:00:00Z"),
      arrivalTime: new Date("2025-12-02T06:30:00Z"),
    },
  ];

  // Filter out invalid entries and insert
  const validSchedules = scheduleData.filter(
    (s) => s.trainId && s.originStationId && s.destinationStationId
  );

  if (validSchedules.length > 0) {
    await db.insert(schedules).values(validSchedules);
    console.log(`✅ Inserted ${validSchedules.length} schedules`);
  } else {
    console.log("⚠️ No valid schedules to insert");
  }

  console.log("🎯 Schedules seeding completed!");
}
