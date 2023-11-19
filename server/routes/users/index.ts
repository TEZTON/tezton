import { mergeRouter } from "@/server";
import { userMutations } from "./userMutations";

export const userRouter = mergeRouter(userMutations);
