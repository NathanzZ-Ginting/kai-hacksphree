import { eq, like, and, desc, asc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { trainSeats } from "../../db/schema/train-seats.ts";
import { TrainSeat } from "../interface/train-seats-interface.ts";

// Get all train seats
export const getAllTrainSeats = async (): Promise<TrainSeat[]> => {
  const collection = await db
    .select()
    .from(trainSeats)
    .orderBy(desc(trainSeats.createdAt));
  return collection as unknown as TrainSeat[];
};

// Get train seat by UUID
export const getTrainSeatByUuid = async (
  uuid: string
): Promise<TrainSeat | null> => {
  const trainSeat = await db
    .select()
    .from(trainSeats)
    .where(eq(trainSeats.uuid, uuid))
    .limit(1);
  return (trainSeat[0] as unknown as TrainSeat) || null;
};

// Get train seats by train ID
export const getTrainSeatsByTrainId = async (
  trainId: string
): Promise<TrainSeat[]> => {
  const collection = await db
    .select()
    .from(trainSeats)
    .where(eq(trainSeats.trainId, trainId))
    .orderBy(asc(trainSeats.nameSeat));
  return collection as unknown as TrainSeat[];
};

// Get train seat by name
export const getTrainSeatByName = async (
  trainId: string,
  nameSeat: string
): Promise<TrainSeat | null> => {
  const trainSeat = await db
    .select()
    .from(trainSeats)
    .where(
      and(eq(trainSeats.trainId, trainId), eq(trainSeats.nameSeat, nameSeat))
    )
    .limit(1);
  return (trainSeat[0] as unknown as TrainSeat) || null;
};

// Search train seats by name pattern
export const searchTrainSeatsByName = async (
  searchPattern: string
): Promise<TrainSeat[]> => {
  const collection = await db
    .select()
    .from(trainSeats)
    .where(like(trainSeats.nameSeat, `%${searchPattern}%`))
    .orderBy(asc(trainSeats.nameSeat));
  return collection as unknown as TrainSeat[];
};

// Create new train seat
export const createTrainSeat = async (
  newTrainSeat: Omit<TrainSeat, "uuid" | "createdAt" | "updatedAt">
): Promise<TrainSeat> => {
  const createdTrainSeat = await db
    .insert(trainSeats)
    .values(newTrainSeat as any)
    .returning();
  return createdTrainSeat[0] as unknown as TrainSeat;
};

// Create multiple train seats (bulk insert)
export const createMultipleTrainSeats = async (
  newTrainSeats: Omit<TrainSeat, "uuid" | "createdAt" | "updatedAt">[]
): Promise<TrainSeat[]> => {
  const createdTrainSeats = await db
    .insert(trainSeats)
    .values(newTrainSeats as any)
    .returning();
  return createdTrainSeats as unknown as TrainSeat[];
};

// Update train seat
export const updateTrainSeat = async (
  uuid: string,
  trainSeatData: Partial<TrainSeat>
): Promise<TrainSeat | null> => {
  const updatedTrainSeat = await db
    .update(trainSeats)
    .set({
      ...trainSeatData,
      updatedAt: new Date(),
    } as any)
    .where(eq(trainSeats.uuid, uuid))
    .returning();
  return (updatedTrainSeat[0] as unknown as TrainSeat) || null;
};

// Update train seat name
export const updateTrainSeatName = async (
  uuid: string,
  nameSeat: string
): Promise<TrainSeat | null> => {
  const updatedTrainSeat = await db
    .update(trainSeats)
    .set({
      nameSeat: nameSeat,
      updatedAt: new Date(),
    })
    .where(eq(trainSeats.uuid, uuid))
    .returning();
  return (updatedTrainSeat[0] as unknown as TrainSeat) || null;
};

// Delete train seat
export const deleteTrainSeat = async (uuid: string): Promise<boolean> => {
  const deletedTrainSeat = await db
    .delete(trainSeats)
    .where(eq(trainSeats.uuid, uuid))
    .returning();
  return deletedTrainSeat.length > 0;
};

// Delete all train seats by train ID
export const deleteTrainSeatsByTrainId = async (
  trainId: string
): Promise<number> => {
  const deletedTrainSeats = await db
    .delete(trainSeats)
    .where(eq(trainSeats.trainId, trainId))
    .returning();
  return deletedTrainSeats.length;
};

// Get train seats with pagination
export const getTrainSeatsWithPagination = async (
  page: number = 1,
  pageSize: number = 10,
  orderBy: "name_asc" | "name_desc" | "date_asc" | "date_desc" = "name_asc"
): Promise<TrainSeat[]> => {
  const offset = (page - 1) * pageSize;

  let orderByClause;
  switch (orderBy) {
    case "name_asc":
      orderByClause = asc(trainSeats.nameSeat);
      break;
    case "name_desc":
      orderByClause = desc(trainSeats.nameSeat);
      break;
    case "date_asc":
      orderByClause = asc(trainSeats.createdAt);
      break;
    case "date_desc":
      orderByClause = desc(trainSeats.createdAt);
      break;
    default:
      orderByClause = asc(trainSeats.nameSeat);
  }

  const collection = await db
    .select()
    .from(trainSeats)
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset(offset);
  return collection as unknown as TrainSeat[];
};

// Count total train seats
export const countTrainSeats = async (): Promise<number> => {
  const result = await db.select().from(trainSeats);
  return result.length;
};

// Count train seats by train ID
export const countTrainSeatsByTrainId = async (
  trainId: string
): Promise<number> => {
  const result = await db
    .select()
    .from(trainSeats)
    .where(eq(trainSeats.trainId, trainId));
  return result.length;
};

// Check if seat name exists for a specific train
export const isSeatNameExists = async (
  trainId: string,
  nameSeat: string,
  excludeUuid?: string
): Promise<boolean> => {
  const whereConditions = [
    eq(trainSeats.trainId, trainId),
    eq(trainSeats.nameSeat, nameSeat),
  ];

  if (excludeUuid) {
    whereConditions.push(eq(trainSeats.uuid, excludeUuid));
  }

  const result = await db
    .select()
    .from(trainSeats)
    .where(and(...whereConditions))
    .limit(1);

  return excludeUuid ? result.length === 0 : result.length > 0;
};
