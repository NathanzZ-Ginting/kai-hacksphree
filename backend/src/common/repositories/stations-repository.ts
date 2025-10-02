import { eq, like, and, asc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { stations } from "../../db/schema.ts";
import { Station } from "../interface/stations-interface.ts";

// Get all stations
export const getAllStations = async (): Promise<Station[]> => {
  const collection = await db
    .select()
    .from(stations)
    .orderBy(asc(stations.name));
  return collection as Station[];
};

// Get station by UUID
export const getStationByUuid = async (
  uuid: string
): Promise<Station | null> => {
  const station = await db
    .select()
    .from(stations)
    .where(eq(stations.uuid, uuid))
    .limit(1);
  return (station[0] as Station) || null;
};

// Get station by station code
export const getStationByCode = async (
  stationCode: string
): Promise<Station | null> => {
  const station = await db
    .select()
    .from(stations)
    .where(eq(stations.stationCode, stationCode))
    .limit(1);
  return (station[0] as Station) || null;
};

// Get stations by location ID
export const getStationsByLocationId = async (
  locationId: string
): Promise<Station[]> => {
  const collection = await db
    .select()
    .from(stations)
    .where(eq(stations.locationId, locationId))
    .orderBy(asc(stations.name));
  return collection as Station[];
};

// Search stations by name
export const searchStationsByName = async (
  name: string
): Promise<Station[]> => {
  const collection = await db
    .select()
    .from(stations)
    .where(like(stations.name, `%${name}%`))
    .orderBy(asc(stations.name));
  return collection as Station[];
};

// Create new station
export const createStation = async (
  newStation: Omit<Station, "uuid" | "createdAt" | "updatedAt">
): Promise<Station> => {
  const createdStation = await db
    .insert(stations)
    .values(newStation as any)
    .returning();
  return createdStation[0] as Station;
};

// Update station
export const updateStation = async (
  uuid: string,
  stationData: Partial<Station>
): Promise<Station | null> => {
  const updatedStation = await db
    .update(stations)
    .set(stationData)
    .where(eq(stations.uuid, uuid))
    .returning();
  return (updatedStation[0] as Station) || null;
};

// Delete station
export const deleteStation = async (uuid: string): Promise<boolean> => {
  const deletedStation = await db
    .delete(stations)
    .where(eq(stations.uuid, uuid))
    .returning();
  return deletedStation.length > 0;
};

// Get stations with pagination
export const getStationsWithPagination = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Station[]> => {
  const offset = (page - 1) * pageSize;
  const collection = await db
    .select()
    .from(stations)
    .orderBy(asc(stations.name))
    .limit(pageSize)
    .offset(offset);
  return collection as Station[];
};
