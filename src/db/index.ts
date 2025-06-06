import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

// TODO: Replace with your actual connection string from environment variables
// For local development, this might point to the Dockerized Postgres instance
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nextfaster";

export const client = new Client({
  connectionString,
});

// It's often better to connect lazily or manage connections explicitly.
// For Next.js, you might connect when a request comes in or at server start.
// For simplicity in this script, we won't call client.connect() here.
// The application code using 'db' will be responsible for ensuring the client is connected.

export const db = drizzle(client, { schema });
