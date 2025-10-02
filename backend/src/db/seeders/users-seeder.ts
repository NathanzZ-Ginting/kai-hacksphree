import { db } from "../index.ts";
import { users } from "../schema/users.ts";
import bcrypt from "bcrypt";

export async function seedUsers() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const userData = [
    {
      name: "Admin User",
      age: 30,
      email: "admin@kai.co.id",
      password: hashedPassword,
      phoneNumber: "081234567890",
    },
    {
      name: "John Doe",
      age: 25,
      email: "john.doe@example.com",
      password: hashedPassword,
      phoneNumber: "081234567891",
    },
    {
      name: "Jane Smith",
      age: 28,
      email: "jane.smith@example.com",
      password: hashedPassword,
      phoneNumber: "081234567892",
    },
    {
      name: "Ahmad Rizki",
      age: 32,
      email: "ahmad.rizki@example.com",
      password: hashedPassword,
      phoneNumber: "081234567893",
    },
    {
      name: "Siti Nurhaliza",
      age: 26,
      email: "siti.nurhaliza@example.com",
      password: hashedPassword,
      phoneNumber: "081234567894",
    },
  ];

  await db.insert(users).values(userData);
}
