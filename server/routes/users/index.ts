import { mergeRouter } from "@/server";
import { userMutations } from "./userMutations";
import { userQueries } from "./userQueries";

export const userRouter = mergeRouter(userQueries, userMutations);
