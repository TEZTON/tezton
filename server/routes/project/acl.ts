import { companiesSchema, productsSchema, projectsSchema } from "../../schema";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError, experimental_standaloneMiddleware } from "@trpc/server";
import { ExperimentalMiddlewareContext } from "../../context";

export const projectIdAccessMiddleware = experimental_standaloneMiddleware<{
  ctx: ExperimentalMiddlewareContext;
  input: { productId: string; projectId: string };
}>().create(
  async ({ ctx: { db, user }, input: { productId, projectId }, next }) => {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectsSchema)
      .leftJoin(productsSchema, eq(productsSchema.id, projectsSchema.productId))
      .leftJoin(
        companiesSchema,
        eq(companiesSchema.id, productsSchema.companyId)
      )
      .where(
        and(
          eq(projectsSchema.id, projectId),
          eq(productsSchema.id, productId),
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
