import { mergeRouter } from "@/server";
import { deliverableDiagramsMutations } from "./deliverableDiagramsMutations";
import { deliverableDiagramsQueries } from "./deliverableDiagramsQueries";

export const deliverableDiagramsRouter = mergeRouter(
  deliverableDiagramsMutations,
  deliverableDiagramsQueries
);
