import { mergeRouter } from "@/server";
import { deliverablesMutations } from "./deliverablesMutations";
import { deliverablesQueries } from "./deliverablesQueries";

export const deliverableRouter = mergeRouter(
  deliverablesMutations,
  deliverablesQueries
);
