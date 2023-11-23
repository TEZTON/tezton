import { appRouter } from "@/server/app";
import { createContext } from "@/server/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api",
    req,
    router: appRouter,
    createContext,
  });
};
export { handler as GET, handler as POST };
