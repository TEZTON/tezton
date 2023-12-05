import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import { functionalitiesSchema, projectsSchema } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  functionalityAccessMiddleware,
  functionalityIdAccessMiddleware,
} from "./acl";
import {
  FunctionalitySchema,
  SingleFunctionalitySchema,
} from "@/schema/functionality";

export const functionalitiesQueries = router({
  getFunctionalities: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .use(functionalityAccessMiddleware)
    .output(z.array(FunctionalitySchema))
    .query(async ({ ctx: { db }, input: { projectId } }) => {
      const result = await db
        .select()
        .from(functionalitiesSchema)
        .where(and(eq(functionalitiesSchema.projectId, projectId)));

      return result;
    }),

  byId: protectedProcedure
    .input(SingleFunctionalitySchema)
    .output(FunctionalitySchema)
    .use(functionalityIdAccessMiddleware)
    .query(async ({ ctx: { db }, input: { projectId, functionalityId } }) => {
      const result = await db
        .select()
        .from(functionalitiesSchema)
        .where(
          and(
            eq(functionalitiesSchema.id, functionalityId),
            eq(functionalitiesSchema.projectId, projectId)
          )
        );

      if (result.length !== 1) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return result[0];
    }),
});
