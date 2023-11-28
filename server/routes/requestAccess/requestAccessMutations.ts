import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import {
  AcceptOrRejectRequestAccessSchema,
  RequestAccessSchema,
  RequestAccessStatus,
} from "@/schema/requestAccess";
import { requestAccessSchema } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const requestAccessMutations = router({
  request: protectedProcedure
    .input(RequestAccessSchema)
    .output(z.string())
    .mutation(async ({ ctx: { db, user }, input: { companyId } }) => {
      await db.insert(requestAccessSchema).values({
        companyId,
        userId: user.id,
        status: RequestAccessStatus.Enum.pending,
      });
      return "OK";
    }),
  accept: protectedProcedure
    .input(AcceptOrRejectRequestAccessSchema)
    .output(z.string())
    .mutation(async ({ ctx: { db }, input: { companyId, userId } }) => {
      await db
        .update(requestAccessSchema)
        .set({
          status: RequestAccessStatus.Enum.approved,
        })
        .where(
          and(
            eq(requestAccessSchema.companyId, companyId),
            eq(requestAccessSchema.userId, userId)
          )
        );
      return "OK";
    }),

  reject: protectedProcedure
    .input(AcceptOrRejectRequestAccessSchema)
    .output(z.string())
    .mutation(async ({ ctx: { db }, input: { companyId, userId } }) => {
      await db
        .update(requestAccessSchema)
        .set({
          status: RequestAccessStatus.Enum.denied,
        })
        .where(
          and(
            eq(requestAccessSchema.companyId, companyId),
            eq(requestAccessSchema.userId, userId)
          )
        );
      return "OK";
    }),
});
