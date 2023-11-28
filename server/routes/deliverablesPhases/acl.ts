import {
  companiesSchema,
  deliverablesSchema,
  functionalitiesSchema,
  productsSchema,
  projectsSchema,
  requestAccessSchema,
} from "../../db/schema";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { TRPCError, experimental_standaloneMiddleware } from "@trpc/server";
import { ExperimentalMiddlewareContext } from "../../context";
import { RequestAccessStatus } from "@/schema/requestAccess";

export const deliverableIdAccessMiddleware = experimental_standaloneMiddleware<{
  ctx: ExperimentalMiddlewareContext;
  input: {
    deliverableId: string;
  };
}>().create(async ({ ctx: { db, user }, input: { deliverableId }, next }) => {
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
    .from(deliverablesSchema)
    .leftJoin(
      functionalitiesSchema,
      eq(functionalitiesSchema.id, deliverablesSchema.functionalityId)
    )
    .leftJoin(
      projectsSchema,
      eq(projectsSchema.id, functionalitiesSchema.projectId)
    )
    .leftJoin(productsSchema, eq(productsSchema.id, projectsSchema.productId))
    .leftJoin(companiesSchema, eq(companiesSchema.id, productsSchema.companyId))
    .where(
      and(
        eq(deliverablesSchema.id, deliverableId),
        or(
          inArray(
            companiesSchema.id,
            permission.map((c) => c.companyId)
          ),
          eq(companiesSchema.userId, user.id)
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
