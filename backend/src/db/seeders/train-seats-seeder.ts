import { db } from "../index.ts";
import { trainSeats } from "../schema/train-seats.ts";
import { trains } from "../schema/trains.ts";

export async function seedTrainSeats() {
  console.log("🪑 Seeding train seats...");

  // Get all trains first
  const allTrains = await db.select().from(trains);

  const trainSeatsData = [];

  // Generate seats for each train
  for (const train of allTrains) {
    // Generate seats based on train category
    let seatPattern: string[] = [];

    if (train.name?.includes("Argo") || train.trainCode?.includes("ARGO")) {
      // Executive class - 2-1 configuration, 8 seats per car, 4 cars
      for (let car = 1; car <= 4; car++) {
        for (let row = 1; row <= 4; row++) {
          seatPattern.push(`${car}A${row}`); // Window seat left
          seatPattern.push(`${car}B${row}`); // Aisle seat left
          seatPattern.push(`${car}C${row}`); // Single seat right
        }
      }
    } else if (
      train.name?.includes("Turangga") ||
      train.trainCode?.includes("TURANGGA")
    ) {
      // Business class - 2-2 configuration, 16 seats per car, 3 cars
      for (let car = 1; car <= 3; car++) {
        for (let row = 1; row <= 8; row++) {
          seatPattern.push(`${car}A${row}`); // Window seat left
          seatPattern.push(`${car}B${row}`); // Aisle seat left
          seatPattern.push(`${car}C${row}`); // Aisle seat right
          seatPattern.push(`${car}D${row}`); // Window seat right
        }
      }
    } else {
      // Economy class - 3-2 configuration, 25 seats per car, 6 cars
      for (let car = 1; car <= 6; car++) {
        for (let row = 1; row <= 10; row++) {
          seatPattern.push(`${car}A${row}`); // Window seat left
          seatPattern.push(`${car}B${row}`); // Middle seat left
          seatPattern.push(`${car}C${row}`); // Aisle seat left
          seatPattern.push(`${car}D${row}`); // Aisle seat right
          seatPattern.push(`${car}E${row}`); // Window seat right
        }
      }
    }

    // Add seats for this train
    for (const seatName of seatPattern) {
      trainSeatsData.push({
        trainId: train.uuid,
        nameSeat: seatName,
      });
    }
  }

  // Insert all train seats
  if (trainSeatsData.length > 0) {
    await db.insert(trainSeats).values(trainSeatsData);
    console.log(`✅ Inserted ${trainSeatsData.length} train seats`);
  } else {
    console.log("⚠️ No train seats to insert");
  }

  console.log("🎯 Train seats seeding completed!");
}
