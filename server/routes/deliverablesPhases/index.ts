import { mergeRouter } from "@/server";
import { deliverablesPhasesMutations } from "./deliverablesMutations";
import { deliverablePhasesQueries } from "./deliverablesQueries";

export const deliverablePhasesRouter = mergeRouter(
  deliverablesPhasesMutations,
  deliverablePhasesQueries
);
