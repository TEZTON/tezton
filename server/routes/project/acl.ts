import {
  companiesSchema,
  productsSchema,
  projectsSchema,
  requestAccessSchema,
} from "../../db/schema";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { TRPCError, experimental_standaloneMiddleware } from "@trpc/server";
import { ExperimentalMiddlewareContext } from "../../context";
import { RequestAccessStatus } from "@/schema/requestAccess";

export const projectIdAccessMiddleware = experimental_standaloneMiddleware<{
  ctx: ExperimentalMiddlewareContext;
  input: { productId: string; projectId: string };
}>().create(
  async ({ ctx: { db, user }, input: { productId, projectId }, next }) => {
    const permission = await db
      .select({ companyId: requestAccessSchema.companyId })
      .from(requestAccessSchema)
      .where(
        and(
          eq(requestAccessSchema.userId, user.id),
          eq(requestAccessSchema.status, RequestAccessStatus.Enum.approved)
        )
      );

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
          or(
            eq(companiesSchema.userId, user.id),
            inArray(
              companiesSchema.id,
              permission.map((p) => p.companyId)
            )
          )
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

export const projectAccessMiddleware = experimental_standaloneMiddleware<{
  ctx: ExperimentalMiddlewareContext;
  input: { productId: string };
}>().create(async ({ ctx: { db, user }, input: { productId }, next }) => {
  const permission = await db
    .select({ companyId: requestAccessSchema.companyId })
    .from(requestAccessSchema)
    .where(
      and(
        eq(requestAccessSchema.userId, user.id),
        eq(requestAccessSchema.status, RequestAccessStatus.Enum.approved)
      )
    );

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(productsSchema)
    .leftJoin(companiesSchema, eq(companiesSchema.id, productsSchema.companyId))
    .where(
      and(
        eq(productsSchema.id, productId),
        or(
          eq(companiesSchema.userId, user.id),
          inArray(
            companiesSchema.id,
            permission.map((p) => p.companyId)
          )
        )
      )
    );

  if (!result[0] || result[0].count !== 1) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid parameters",
    });
  }

  return next();
});
