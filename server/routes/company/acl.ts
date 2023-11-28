import { companiesSchema, requestAccessSchema } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError, experimental_standaloneMiddleware } from "@trpc/server";
import { ExperimentalMiddlewareContext } from "../../context";
import { RequestAccessStatus } from "@/schema/requestAccess";

export const companyIdAccessMiddleware = experimental_standaloneMiddleware<{
  ctx: ExperimentalMiddlewareContext;
  input: { companyId: string };
}>().create(async ({ ctx: { db, user }, input: { companyId }, next }) => {
  const permission = await db
    .select()
    .from(requestAccessSchema)
    .where(
      and(
        eq(requestAccessSchema.companyId, companyId),
        eq(requestAccessSchema.userId, user.id),
        eq(requestAccessSchema.status, RequestAccessStatus.Enum.approved)
      )
    );

  const company = await db
    .select()
    .from(companiesSchema)
    .where(
      and(
        eq(companiesSchema.userId, user.id),
        eq(companiesSchema.id, companyId)
      )
    );

  if (company.length !== 1 && permission.length !== 1) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  return next();
});
