import { db } from "../index";
import { stations } from "../schema/stations";
import { locations } from "../schema/locations";
import { eq } from "drizzle-orm";

export async function seedStations() {
  // Get location UUIDs first
  const allLocations = await db.select().from(locations);

  const stationData = [
    {
      name: "Stasiun Gambir",
      stationCode: "GMR",
      locationId: allLocations.find((loc) => loc.city === "Jakarta")?.uuid,
    },
    {
      name: "Stasiun Pasar Senen",
      stationCode: "PSE",
      locationId: allLocations.find((loc) => loc.city === "Jakarta")?.uuid,
    },
    {
      name: "Stasiun Bandung",
      stationCode: "BD",
      locationId: allLocations.find((loc) => loc.city === "Bandung")?.uuid,
    },
    {
      name: "Stasiun Gubeng",
      stationCode: "SGU",
      locationId: allLocations.find((loc) => loc.city === "Surabaya")?.uuid,
    },
    {
      name: "Stasiun Pasar Turi",
      stationCode: "PAS",
      locationId: allLocations.find((loc) => loc.city === "Surabaya")?.uuid,
    },
    {
      name: "Stasiun Tugu",
      stationCode: "YK",
      locationId: allLocations.find((loc) => loc.city === "Yogyakarta")?.uuid,
    },
    {
      name: "Stasiun Lempuyangan",
      stationCode: "LPN",
      locationId: allLocations.find((loc) => loc.city === "Yogyakarta")?.uuid,
    },
    {
      name: "Stasiun Semarang Tawang",
      stationCode: "SMT",
      locationId: allLocations.find((loc) => loc.city === "Semarang")?.uuid,
    },
    {
      name: "Stasiun Solo Balapan",
      stationCode: "SLO",
      locationId: allLocations.find((loc) => loc.city === "Solo")?.uuid,
    },
    {
      name: "Stasiun Malang",
      stationCode: "ML",
      locationId: allLocations.find((loc) => loc.city === "Malang")?.uuid,
    },
  ];

  await db.insert(stations).values(stationData.filter((s) => s.locationId));
}
