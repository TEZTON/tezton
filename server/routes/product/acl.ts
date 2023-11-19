import { companiesSchema, productsSchema } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError, experimental_standaloneMiddleware } from "@trpc/server";
import { ExperimentalMiddlewareContext } from "../../context";

export const productIdAccessMiddleware = experimental_standaloneMiddleware<{
  ctx: ExperimentalMiddlewareContext;
  input: { companyId: string; productId: string };
}>().create(
  async ({ ctx: { db, user }, input: { companyId, productId }, next }) => {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(productsSchema)
      .leftJoin(
        companiesSchema,
        eq(productsSchema.companyId, companiesSchema.id)
      )
      .where(
        and(
          eq(productsSchema.id, productId),
          eq(productsSchema.companyId, companyId),
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
