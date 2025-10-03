#!/usr/bin/env node

import { runSeeders } from "./seeders/index";

console.log("🌱 Running database seeders...");
runSeeders()
  .then(() => {
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
