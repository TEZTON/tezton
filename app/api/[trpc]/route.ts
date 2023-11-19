import { appRouter } from "@/server/app";
import { createContext } from "@/server/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api",
    req,
    router: appRouter,
    // createContext: (a) => {
    //   console.log(123);
    // },
    createContext,
  });
export { handler as GET, handler as POST };
