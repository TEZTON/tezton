import { mergeRouter } from "@/server";
import { productMutations } from "./productMutations";
import { productQueries } from "./productQueries";

export const productRouter = mergeRouter(productQueries, productMutations);
