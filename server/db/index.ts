import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const tursoUrl = process.env.TURSO_URL;
const tursoAuth = process.env.TURSO_TOKEN;
let INSTANCE: LibSQLDatabase<Record<string, never>> | null = null;

export function getDbInstance(filename_test?: string) {
  if (!INSTANCE) {
    const libsqlClient = createClient({
      url: filename_test ? filename_test : tursoUrl!,
      authToken: tursoAuth,
    });
    INSTANCE = drizzle(libsqlClient);
  }

  return INSTANCE;
}
