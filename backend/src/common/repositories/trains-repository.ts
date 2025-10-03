import { eq, like, and, asc } from "drizzle-orm";
import { db } from "../../db/index";
import { trains } from "../../db/schema";
import { Train } from "../interface/trains-interface";

// Get all trains
export const getAllTrains = async (): Promise<Train[]> => {
  const collection = await db.select().from(trains).orderBy(asc(trains.name));
  return collection as Train[];
};

// Get train by UUID
export const getTrainByUuid = async (uuid: string): Promise<Train | null> => {
  const train = await db
    .select()
    .from(trains)
    .where(eq(trains.uuid, uuid))
    .limit(1);
  return (train[0] as Train) || null;
};

// Get train by train code
export const getTrainByCode = async (
  trainCode: string
): Promise<Train | null> => {
  const train = await db
    .select()
    .from(trains)
    .where(eq(trains.trainCode, trainCode))
    .limit(1);
  return (train[0] as Train) || null;
};

// Get trains by category ID
export const getTrainsByCategoryId = async (
  categoryId: string
): Promise<Train[]> => {
  const collection = await db
    .select()
    .from(trains)
    .where(eq(trains.categoryId, categoryId))
    .orderBy(asc(trains.name));
  return collection as Train[];
};

// Create new train
export const createTrain = async (
  newTrain: Omit<Train, "uuid" | "createdAt" | "updatedAt">
): Promise<Train> => {
  const createdTrain = await db
    .insert(trains)
    .values(newTrain as any)
    .returning();
  return createdTrain[0] as Train;
};

// Update train
export const updateTrain = async (
  uuid: string,
  trainData: Partial<Train>
): Promise<Train | null> => {
  const updatedTrain = await db
    .update(trains)
    .set(trainData)
    .where(eq(trains.uuid, uuid))
    .returning();
  return (updatedTrain[0] as Train) || null;
};

// Delete train
export const deleteTrain = async (uuid: string): Promise<boolean> => {
  const deletedTrain = await db
    .delete(trains)
    .where(eq(trains.uuid, uuid))
    .returning();
  return deletedTrain.length > 0;
};

// Get trains with pagination
export const getTrainsWithPagination = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Train[]> => {
  const offset = (page - 1) * pageSize;
  const collection = await db
    .select()
    .from(trains)
    .orderBy(asc(trains.name))
    .limit(pageSize)
    .offset(offset);
  return collection as Train[];
};