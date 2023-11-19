require("dotenv").config();
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDbInstance } from "./db";

async function migration() {
  console.log("Running migration...");
  await migrate(getDbInstance(), { migrationsFolder: "drizzle" });
  console.log("done!");
}

migration().catch((err) => {
  console.error(err);
  process.exit(1);
});
