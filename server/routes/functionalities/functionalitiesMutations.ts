import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import {
  companiesSchema,
  functionalitiesSchema,
  productsSchema,
  projectsSchema,
} from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { functionalityIdAccessMiddleware } from "./acl";
import {
  SingleFunctionalitySchema,
  UpsertFunctionalitySchema,
} from "@/schema/functionality";

export const functionalitiesMutations = router({
  createFunctionality: protectedProcedure
    .input(UpsertFunctionalitySchema)
    .output(z.string())
    .mutation(
      async ({
        ctx: { db, user },
        input: { name, description, projectId },
      }) => {
        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(projectsSchema)
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

        if (result.length !== 1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Project: ${projectId} does not exist.`,
          });
        }

        const r = await db
          .insert(functionalitiesSchema)
          .values({ name, description, projectId })
          .returning({ id: functionalitiesSchema.id });

        return r[0].id;
      }
    ),

  updateFunctionality: protectedProcedure
    .input(
      UpsertFunctionalitySchema.extend({ functionalityId: z.string().uuid() })
    )
    .output(z.string())
    .use(functionalityIdAccessMiddleware)
    .mutation(
      async ({
        ctx: { db },
        input: { name, description, functionalityId },
      }) => {
        await db
          .update(functionalitiesSchema)
          .set({
            ...(name && { name }),
            ...(description && { description }),
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(and(eq(functionalitiesSchema.id, functionalityId)));

        return "OK";
      }
    ),

  deleteFunctionality: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/project/{projectId}/functionality/{functionalityId}",
      },
    })
    .input(SingleFunctionalitySchema)
    .output(z.string())
    .use(functionalityIdAccessMiddleware)
    .mutation(async ({ ctx: { db }, input: { functionalityId } }) => {
      await db
        .delete(functionalitiesSchema)
        .where(and(eq(functionalitiesSchema.id, functionalityId)));

      return "OK";
    }),
});
