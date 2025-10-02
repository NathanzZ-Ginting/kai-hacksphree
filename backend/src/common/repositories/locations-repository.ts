import { eq, like, and, asc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { locations } from "../../db/schema.ts";
import { Location } from "../interface/locations-interface.ts";

// Get all locations
export const getAllLocations = async (): Promise<Location[]> => {
  const collection = await db
    .select()
    .from(locations)
    .orderBy(asc(locations.city));
  return collection as Location[];
};

// Get location by UUID
export const getLocationByUuid = async (
  uuid: string
): Promise<Location | null> => {
  const location = await db
    .select()
    .from(locations)
    .where(eq(locations.uuid, uuid))
    .limit(1);
  return (location[0] as Location) || null;
};

// Get location by city name
export const getLocationByCity = async (
  city: string
): Promise<Location | null> => {
  const location = await db
    .select()
    .from(locations)
    .where(eq(locations.city, city))
    .limit(1);
  return (location[0] as Location) || null;
};

// Search locations by city name
export const searchLocationsByCity = async (
  city: string
): Promise<Location[]> => {
  const collection = await db
    .select()
    .from(locations)
    .where(like(locations.city, `%${city}%`))
    .orderBy(asc(locations.city));
  return collection as Location[];
};

// Get locations by coordinates range (for nearby locations)
export const getLocationsByCoordinates = async (
  centerLat: number,
  centerLng: number,
  radiusKm: number = 50
): Promise<Location[]> => {
  // Note: This is a simplified distance calculation
  // For production, consider using PostGIS or more accurate geo functions
  const collection = await db.select().from(locations);

  return collection.filter((location) => {
    if (!location.latitude || !location.longitude) return false;

    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);

    // Simple distance calculation (Haversine formula approximation)
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat - centerLat) * Math.PI) / 180;
    const dLng = ((lng - centerLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((centerLat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusKm;
  }) as Location[];
};

// Get locations by criteria
export const getLocationsByCriteria = async (criteria: {
  city?: string;
  description?: string;
}): Promise<Location[]> => {
  const conditions = [];

  if (criteria.city) {
    conditions.push(like(locations.city, `%${criteria.city}%`));
  }

  if (criteria.description) {
    conditions.push(like(locations.description, `%${criteria.description}%`));
  }

  let collection;
  if (conditions.length > 0) {
    collection = await db
      .select()
      .from(locations)
      .where(and(...conditions))
      .orderBy(asc(locations.city));
  } else {
    collection = await db.select().from(locations).orderBy(asc(locations.city));
  }

  return collection as Location[];
};

// Create new location
export const createLocation = async (
  newLocation: Omit<Location, "uuid" | "createdAt" | "updatedAt">
): Promise<Location> => {
  const createdLocation = await db
    .insert(locations)
    .values(newLocation as any)
    .returning();
  return createdLocation[0] as Location;
};

// Update location
export const updateLocation = async (
  uuid: string,
  locationData: Partial<Location>
): Promise<Location | null> => {
  const updatedLocation = await db
    .update(locations)
    .set(locationData)
    .where(eq(locations.uuid, uuid))
    .returning();
  return (updatedLocation[0] as Location) || null;
};

// Delete location
export const deleteLocation = async (uuid: string): Promise<boolean> => {
  const deletedLocation = await db
    .delete(locations)
    .where(eq(locations.uuid, uuid))
    .returning();
  return deletedLocation.length > 0;
};

// Get locations with pagination
export const getLocationsWithPagination = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Location[]> => {
  const offset = (page - 1) * pageSize;
  const collection = await db
    .select()
    .from(locations)
    .orderBy(asc(locations.city))
    .limit(pageSize)
    .offset(offset);
  return collection as Location[];
};
