import { mergeRouter } from "@/server";
import { deliverableTypesQueries } from "./deliverableTypesQueries";

export const deliverableTypeRouter = mergeRouter(deliverableTypesQueries);
