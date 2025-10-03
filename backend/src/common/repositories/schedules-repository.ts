import { eq, and, or, gte, lte, desc, asc, ilike } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../../db/index.ts";
import { schedules, stations, trains } from "../../db/schema.ts";
import { Schedule } from "../interface/schedules-interface.ts";

// Get all schedules
export const getAllSchedules = async (): Promise<Schedule[]> => {
  const collection = await db
    .select()
    .from(schedules)
    .orderBy(asc(schedules.departureTime));
  return collection as Schedule[];
};

// Get schedule by UUID
export const getScheduleByUuid = async (
  uuid: string
): Promise<Schedule | null> => {
  const schedule = await db
    .select()
    .from(schedules)
    .where(eq(schedules.uuid, uuid))
    .limit(1);
  return (schedule[0] as Schedule) || null;
};

// Get schedules by train ID
export const getSchedulesByTrainId = async (
  trainId: string
): Promise<Schedule[]> => {
  const collection = await db
    .select()
    .from(schedules)
    .where(eq(schedules.trainId, trainId))
    .orderBy(asc(schedules.departureTime));
  return collection as Schedule[];
};

// Get schedules by origin station
export const getSchedulesByOriginStation = async (
  originStationId: string
): Promise<Schedule[]> => {
  const collection = await db
    .select()
    .from(schedules)
    .where(eq(schedules.originStationId, originStationId))
    .orderBy(asc(schedules.departureTime));
  return collection as Schedule[];
};

// Get schedules by destination station
export const getSchedulesByDestinationStation = async (
  destinationStationId: string
): Promise<Schedule[]> => {
  const collection = await db
    .select()
    .from(schedules)
    .where(eq(schedules.destinationStationId, destinationStationId))
    .orderBy(asc(schedules.departureTime));
  return collection as Schedule[];
};

// Search schedules by route (origin and destination)
export const getSchedulesByRoute = async (
  originStationId: string,
  destinationStationId: string
): Promise<Schedule[]> => {
  const collection = await db
    .select()
    .from(schedules)
    .where(
      and(
        eq(schedules.originStationId, originStationId),
        eq(schedules.destinationStationId, destinationStationId)
      )
    )
    .orderBy(asc(schedules.departureTime));
  return collection as Schedule[];
};

// Debug function: Get all stations to check available station names
export const getAllStationsForDebug = async () => {
  try {
    const allStations = await db.select().from(stations);
    console.log(
      "Available stations:",
      allStations.map((s) => s.name)
    );
    return allStations;
  } catch (error) {
    console.error("Error getting stations:", error);
    throw error;
  }
};

// Create new schedule
export const createSchedule = async (
  newSchedule: Omit<Schedule, "uuid" | "createdAt" | "updatedAt">
): Promise<Schedule> => {
  const createdSchedule = await db
    .insert(schedules)
    .values(newSchedule as any)
    .returning();
  return createdSchedule[0] as Schedule;
};

// Update schedule
export const updateSchedule = async (
  uuid: string,
  scheduleData: Partial<Schedule>
): Promise<Schedule | null> => {
  const updatedSchedule = await db
    .update(schedules)
    .set(scheduleData)
    .where(eq(schedules.uuid, uuid))
    .returning();
  return (updatedSchedule[0] as Schedule) || null;
};

// Delete schedule
export const deleteSchedule = async (uuid: string): Promise<boolean> => {
  const deletedSchedule = await db
    .delete(schedules)
    .where(eq(schedules.uuid, uuid))
    .returning();
  return deletedSchedule.length > 0;
};

export const filterByOriginAndDestination = async (
  originStationId: string,
  destinationStationId: string
) => {
  try {
    const originStation = alias(stations, "origin_station");
    const destinationStation = alias(stations, "destination_station");

    const collection = await db
      .select({
        trainName: trains.name,
        originStationName: originStation.name,
        destinationStationName: destinationStation.name,
        departureTime: schedules.departureTime,
        arrivalTime: schedules.arrivalTime,
      })
      .from(schedules)
      .where(
        and(
          eq(schedules.originStationId, originStationId),
          eq(schedules.destinationStationId, destinationStationId)
        )
      )
      .innerJoin(
        originStation,
        eq(schedules.originStationId, originStation.uuid)
      )
      .innerJoin(
        destinationStation,
        eq(schedules.destinationStationId, destinationStation.uuid)
      )
      .innerJoin(trains, eq(schedules.trainId, trains.uuid))
      .orderBy(asc(schedules.departureTime));

    console.log(`Repository: Found ${collection.length} schedules`);
    return collection;
  } catch (error) {
    console.error("Error in filterByOriginAndDestination:", error);
    throw error;
  }
};
