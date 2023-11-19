import {
  companiesSchema,
  functionalitiesSchema,
  productsSchema,
  projectsSchema,
} from "../../schema";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError, experimental_standaloneMiddleware } from "@trpc/server";
import { ExperimentalMiddlewareContext } from "../../context";

export const functionalityIdAccessMiddleware =
  experimental_standaloneMiddleware<{
    ctx: ExperimentalMiddlewareContext;
    input: {
      projectId: string;
      functionalityId: string;
    };
  }>().create(
    async ({
      ctx: { db, user },
      input: { projectId, functionalityId },
      next,
    }) => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
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

      if (!result[0] || result[0].count !== 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid parameters",
        });
      }

      return next();
    }
  );
