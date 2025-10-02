import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { schedules } from "../../db/schema.ts";
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

// Get schedules by date range
export const getSchedulesByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<Schedule[]> => {
  const collection = await db
    .select()
    .from(schedules)
    .where(
      and(
        gte(schedules.departureTime, startDate),
        lte(schedules.departureTime, endDate)
      )
    )
    .orderBy(asc(schedules.departureTime));
  return collection as Schedule[];
};

// Search schedules by route and date
export const searchSchedules = async (
  originStationId: string,
  destinationStationId: string,
  departureDate: Date
): Promise<Schedule[]> => {
  const startOfDay = new Date(departureDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(departureDate);
  endOfDay.setHours(23, 59, 59, 999);

  const collection = await db
    .select()
    .from(schedules)
    .where(
      and(
        eq(schedules.originStationId, originStationId),
        eq(schedules.destinationStationId, destinationStationId),
        gte(schedules.departureTime, startOfDay),
        lte(schedules.departureTime, endOfDay)
      )
    )
    .orderBy(asc(schedules.departureTime));
  return collection as Schedule[];
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

// Get schedules with pagination
export const getSchedulesWithPagination = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Schedule[]> => {
  const offset = (page - 1) * pageSize;
  const collection = await db
    .select()
    .from(schedules)
    .orderBy(asc(schedules.departureTime))
    .limit(pageSize)
    .offset(offset);
  return collection as Schedule[];
};