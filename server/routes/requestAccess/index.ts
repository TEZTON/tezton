import { mergeRouter } from "@/server";
import { requestAccessMutations } from "./requestAccessMutations";
import { requestAccessQueries } from "./requestAccessQueries";

export const requestAccessRouter = mergeRouter(
  requestAccessQueries,
  requestAccessMutations
);
