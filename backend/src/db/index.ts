import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL!,
// });

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql });
