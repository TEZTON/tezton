import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import { RequestAccessSchema } from "@/schema/requestAccess";
import { requestAccessSchema } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const requestAccessQueries = router({
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
