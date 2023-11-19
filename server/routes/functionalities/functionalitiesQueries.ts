import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import {
  companiesSchema,
  functionalitiesSchema,
  productsSchema,
  projectsSchema,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { functionalityIdAccessMiddleware } from "./acl";
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
    .output(z.array(FunctionalitySchema))
    .query(async ({ ctx: { db, user }, input: { projectId } }) => {
      const result = await db
        .select()
        .from(functionalitiesSchema)
        .leftJoin(
          projectsSchema,
          eq(projectsSchema.id, functionalitiesSchema.projectId)
        )
        .leftJoin(
          productsSchema,
          eq(productsSchema.id, projectsSchema.productId)
        )
        .leftJoin(
          companiesSchema,
          eq(companiesSchema.id, productsSchema.companyId)
        )
        .where(
          and(
            eq(projectsSchema.id, projectId),
            eq(companiesSchema.userId, user.id)
          )
        );

      return result.map(({ functionalities }) => functionalities);
    }),

  byId: protectedProcedure
    .input(SingleFunctionalitySchema)
    .output(FunctionalitySchema)
    .use(functionalityIdAccessMiddleware)
    .query(
      async ({ ctx: { db, user }, input: { projectId, functionalityId } }) => {
        const result = await db
          .select()
          .from(functionalitiesSchema)
          .leftJoin(
            projectsSchema,
            eq(projectsSchema.id, functionalitiesSchema.projectId)
          )
          .leftJoin(
            productsSchema,
            eq(productsSchema.id, projectsSchema.productId)
          )
          .leftJoin(
            companiesSchema,
            eq(companiesSchema.id, productsSchema.companyId)
          )
          .where(
            and(
              eq(functionalitiesSchema.id, functionalityId),
              eq(projectsSchema.id, projectId),
              eq(companiesSchema.userId, user.id)
            )
          );

        if (result.length !== 1) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return result[0].functionalities;
      }
    ),
});
