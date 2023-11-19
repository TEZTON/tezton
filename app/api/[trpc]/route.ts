import { appRouter } from "@/server/app";
import { createContext } from "@/server/context";
import { getDbInstance } from "@/server/db";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { migrate } from "drizzle-orm/libsql/migrator";
const handler = async (req: Request) => {
  await migrate(getDbInstance(), { migrationsFolder: "drizzle" });
  return fetchRequestHandler({
    endpoint: "/api",
    req,
    router: appRouter,
    createContext,
  });
};
export { handler as GET, handler as POST };
