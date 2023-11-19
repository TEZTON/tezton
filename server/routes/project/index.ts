import { mergeRouter } from "@/server";
import { projectMutations } from "./projectMutations";
import { projectQueries } from "./projectQueries";

export const projectRouter = mergeRouter(projectMutations, projectQueries);
