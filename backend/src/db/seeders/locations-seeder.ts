import { db } from "../index";
import { locations } from "../schema/locations";

export async function seedLocations() {
  const locationData = [
    {
      city: "Jakarta",
      description: "Ibu kota Indonesia",
      longitude: "106.8456",
      latitude: "-6.2088",
    },
    {
      city: "Bandung",
      description: "Kota kembang Jawa Barat",
      longitude: "107.6191",
      latitude: "-6.9175",
    },
    {
      city: "Surabaya",
      description: "Kota pahlawan Jawa Timur",
      longitude: "112.7521",
      latitude: "-7.2575",
    },
    {
      city: "Yogyakarta",
      description: "Kota gudeg DIY",
      longitude: "110.3695",
      latitude: "-7.7956",
    },
    {
      city: "Semarang",
      description: "Kota atlas Jawa Tengah",
      longitude: "110.4203",
      latitude: "-6.9932",
    },
    {
      city: "Solo",
      description: "Kota budaya Jawa Tengah",
      longitude: "110.8243",
      latitude: "-7.5568",
    },
    {
      city: "Malang",
      description: "Kota apel Jawa Timur",
      longitude: "112.6304",
      latitude: "-7.9797",
    },
    {
      city: "Cirebon",
      description: "Kota udang Jawa Barat",
      longitude: "108.5570",
      latitude: "-6.7063",
    },
  ];

  await db.insert(locations).values(locationData);
}
