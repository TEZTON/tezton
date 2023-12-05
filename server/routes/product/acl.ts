import {
  companiesSchema,
  productsSchema,
  requestAccessSchema,
} from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError, experimental_standaloneMiddleware } from "@trpc/server";
import { ExperimentalMiddlewareContext } from "../../context";
import { RequestAccessStatus } from "@/schema/requestAccess";

export const productIdAccessMiddleware = experimental_standaloneMiddleware<{
  ctx: ExperimentalMiddlewareContext;
  input: { companyId: string; productId: string };
}>().create(
  async ({ ctx: { db, user }, input: { companyId, productId }, next }) => {
    const permission = await db
      .select()
      .from(requestAccessSchema)
      .where(
        and(
          eq(requestAccessSchema.userId, user.id),
          eq(requestAccessSchema.companyId, companyId),
          eq(requestAccessSchema.status, RequestAccessStatus.Enum.approved)
        )
      );

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

    if (!result[0] || result[0].count !== 1 || permission.length !== 1) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invalid parameters",
      });
    }

    return next();
  }
);

export const productAccessMiddleware = experimental_standaloneMiddleware<{
  ctx: ExperimentalMiddlewareContext;
  input: { companyId: string };
}>().create(async ({ ctx: { db, user }, input: { companyId }, next }) => {
  const permission = await db
    .select()
    .from(requestAccessSchema)
    .where(
      and(
        eq(requestAccessSchema.userId, user.id),
        eq(requestAccessSchema.companyId, companyId),
        eq(requestAccessSchema.status, RequestAccessStatus.Enum.approved)
      )
    );

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(companiesSchema)
    .where(
      and(
        eq(companiesSchema.id, companyId),
        eq(companiesSchema.userId, user.id)
      )
    );

  if (result[0].count === 0 && permission.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Company: ${companyId} does not exist.`,
    });
  }
  return next();
});
