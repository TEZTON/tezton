import { mergeRouter } from "@/server";
import { functionalitiesMutations } from "./functionalitiesMutations";
import { functionalitiesQueries } from "./functionalitiesQueries";

export const functionalityRouter = mergeRouter(
  functionalitiesMutations,
  functionalitiesQueries
);
