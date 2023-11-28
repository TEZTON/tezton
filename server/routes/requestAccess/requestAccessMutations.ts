import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import {
  RequestAccessSchema,
  RequestAccessStatus,
} from "@/schema/requestAccess";
import { requestAccessSchema } from "@/server/db/schema";

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
});
