import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import { deliverablesSchema } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import {
  deliverableAccessMiddleware,
  deliverableIdAccessMiddleware,
} from "./acl";
import {
  SingleDeliverableSchema,
  UpsertDeliverableSchema,
} from "@/schema/deliverable";

export const deliverablesMutations = router({
  createDeliverable: protectedProcedure
    .input(UpsertDeliverableSchema)
    .use(deliverableAccessMiddleware)
    .output(z.string())
    .mutation(
      async ({
        ctx: { db },
        input: { name, description, functionalityId },
      }) => {
        let r = await db
          .insert(deliverablesSchema)
          .values({ name, description, functionalityId })
          .returning({ id: deliverablesSchema.id });

        return r[0].id;
      }
    ),

  updateDeliverable: protectedProcedure
    .input(UpsertDeliverableSchema.extend({ deliverableId: z.string().uuid() }))
    .output(z.string())
    .use(deliverableIdAccessMiddleware)
    .mutation(
      async ({ ctx: { db }, input: { name, description, deliverableId } }) => {
        await db
          .update(deliverablesSchema)
          .set({
            ...(name && { name }),
            ...(description && { description }),
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(and(eq(deliverablesSchema.id, deliverableId)));

        return "OK";
      }
    ),

  deleteDeliverable: protectedProcedure

    .input(SingleDeliverableSchema)
    .output(z.string())
    .use(deliverableIdAccessMiddleware)
    .mutation(
      async ({ ctx: { db }, input: { deliverableId, functionalityId } }) => {
        await db
          .delete(deliverablesSchema)
          .where(
            and(
              eq(deliverablesSchema.id, deliverableId),
              eq(deliverablesSchema.functionalityId, functionalityId)
            )
          );

        return "OK";
      }
    ),
});
