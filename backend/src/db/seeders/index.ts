import { db } from "../index.ts";
import { seedUsers } from "./users-seeder.ts";
import { seedCategories } from "./categories-seeder.ts";
import { seedLocations } from "./locations-seeder.ts";
import { seedStations } from "./stations-seeder.ts";
import { seedTrains } from "./trains-seeder.ts";
import { seedSchedules } from "./schedules-seeder.ts";
import { seedTickets } from "./tickets-seeder.ts";

async function runSeeders() {
  try {
    console.log("🌱 Starting database seeding...");

    // Seed in order due to foreign key dependencies
    await seedUsers();
    console.log("✅ Users seeded");

    await seedCategories();
    console.log("✅ Categories seeded");

    await seedLocations();
    console.log("✅ Locations seeded");

    await seedStations();
    console.log("✅ Stations seeded");

    await seedTrains();
    console.log("✅ Trains seeded");

    await seedSchedules();
    console.log("✅ Schedules seeded");

    await seedTickets();
    console.log("✅ Tickets seeded");

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  }
}

// Run seeders if this file is executed directly
if (import.meta.main) {
  runSeeders();
}

export { runSeeders };
