import { db } from "../index";
import { seedUsers } from "./users-seeder";
import { seedCategories } from "./categories-seeder";
import { seedLocations } from "./locations-seeder";
import { seedStations } from "./stations-seeder";
import { seedTrains } from "./trains-seeder";
import { seedTrainSeats } from "./train-seats-seeder";
import { seedSchedules } from "./schedules-seeder";
import { seedTickets } from "./tickets-seeder";

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

    await seedTrainSeats();
    console.log("✅ Train seats seeded");

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
if (require.main === module) {
  runSeeders();
}

export { runSeeders };
