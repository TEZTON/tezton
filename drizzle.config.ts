require("dotenv").config();
import { Config } from "drizzle-kit";

export default {
  schema: "./server/db/schema/index.ts",
  out: "./drizzle",
  driver: "turso",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.turso_url!,
    authToken: process.env.turso_token,
  },
} satisfies Config;
