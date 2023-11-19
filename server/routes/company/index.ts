import { mergeRouter } from "@/server";
import { companyMutations } from "./companyMutations";
import { companyQueries } from "./companyQueries";

export const companyRouter = mergeRouter(companyQueries, companyMutations);
