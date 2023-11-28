import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import { deliverablesSchema, functionalitiesSchema } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  deliverableAccessMiddleware,
  deliverableIdAccessMiddleware,
} from "./acl";
import {
  DeliverableSchema,
  SingleDeliverableSchema,
} from "@/schema/deliverable";

export const deliverablesQueries = router({
  getDeliverables: protectedProcedure
    .input(
      z.object({
        functionalityId: z.string(),
      })
    )
    .output(z.array(DeliverableSchema))
    .use(deliverableAccessMiddleware)
    .query(async ({ ctx: { db }, input: { functionalityId } }) => {
      return await db
        .select()
        .from(deliverablesSchema)
        .where(eq(deliverablesSchema.functionalityId, functionalityId));
    }),

  byId: protectedProcedure
    .input(SingleDeliverableSchema)
    .output(DeliverableSchema)
    .use(deliverableIdAccessMiddleware)
    .query(
      async ({ ctx: { db }, input: { functionalityId, deliverableId } }) => {
        const result = await db
          .select()
          .from(deliverablesSchema)
          .where(
            and(
              eq(deliverablesSchema.id, deliverableId),
              eq(functionalitiesSchema.id, functionalityId)
            )
          );

        if (result.length !== 1) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return result[0];
      }
    ),
});
