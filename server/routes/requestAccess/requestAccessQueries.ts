import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import { RequestAccessSchema } from "@/schema/requestAccess";
import {
  companiesSchema,
  requestAccessSchema,
  usersSchema,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const requestAccessQueries = router({
  allRequests: protectedProcedure.query(async ({ ctx: { db, user } }) => {
    const result = await db
      .select()
      .from(requestAccessSchema)
      .innerJoin(
        companiesSchema,
        eq(requestAccessSchema.companyId, companiesSchema.id)
      )
      .innerJoin(usersSchema, eq(requestAccessSchema.userId, usersSchema.id))
      .where(eq(companiesSchema.userId, user.id));

    return result.map(({ users, request_access, companies }) => ({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      status: request_access.status,
      companyId: companies.id,
    }));
  }),

  status: protectedProcedure
    .input(RequestAccessSchema)
    .output(z.optional(z.string()))
    .query(async ({ ctx: { db, user }, input: { companyId } }) => {
      const result = await db
        .select()
        .from(requestAccessSchema)
        .where(
          and(
            eq(requestAccessSchema.companyId, companyId),
            eq(requestAccessSchema.userId, user.id)
          )
        );

      if (result.length > 0) {
        return result[0].status;
      }
    }),
});
