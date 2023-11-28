import {
  companiesSchema,
  functionalitiesSchema,
  productsSchema,
  projectsSchema,
  requestAccessSchema,
} from "../../db/schema";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { TRPCError, experimental_standaloneMiddleware } from "@trpc/server";
import { ExperimentalMiddlewareContext } from "../../context";
import { RequestAccessStatus } from "@/schema/requestAccess";

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
            or(
              inArray(
                companiesSchema.id,
                permission.map((p) => p.companyId)
              ),
              eq(companiesSchema.userId, user.id)
            )
          )
        );

      console.log(result);

      if (!result[0] || result[0].count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid parameters",
        });
      }

      return next();
    }
  );

export const functionalityAccessMiddleware = experimental_standaloneMiddleware<{
  ctx: ExperimentalMiddlewareContext;
  input: {
    projectId: string;
  };
}>().create(async ({ ctx: { db, user }, input: { projectId }, next }) => {
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
    .select()
    .from(functionalitiesSchema)
    .leftJoin(
      projectsSchema,
      eq(projectsSchema.id, functionalitiesSchema.projectId)
    )
    .leftJoin(productsSchema, eq(productsSchema.id, projectsSchema.productId))
    .leftJoin(companiesSchema, eq(companiesSchema.id, productsSchema.companyId))
    .where(
      and(
        eq(projectsSchema.id, projectId),
        or(
          inArray(
            companiesSchema.id,
            permission.map((p) => p.companyId)
          ),
          eq(companiesSchema.userId, user.id)
        )
      )
    );

  if (result.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid parameters",
    });
  }

  return next();
});
