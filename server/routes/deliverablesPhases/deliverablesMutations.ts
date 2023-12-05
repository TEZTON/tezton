import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import { deliverableIdAccessMiddleware } from "./acl";
import { UpsertDeliverablePhaseSchema } from "@/schema/deliverable";
import { deliverablePhases } from "../../db/schema";
import { formatISO } from "date-fns";
import { and, eq, sql } from "drizzle-orm";

export const deliverablesPhasesMutations = router({
  createDeliverablePhase: protectedProcedure
    .input(UpsertDeliverablePhaseSchema)
    .use(deliverableIdAccessMiddleware)
    .output(z.string())
    .mutation(
      async ({
        ctx: { db },
        input: {
          deliverableId,
          deliverableTypeId,
          endDate,
          name,
          startDate,
          description
        }
      }) => {
        await db.insert(deliverablePhases).values({
          deliverableId,
          type: deliverableTypeId,
          endDate: formatISO(endDate),
          name,
          startDate: formatISO(startDate),
          description
        });

        return "OK";
      }
    ),

  updateDeliverablePhase: protectedProcedure
    .input(UpsertDeliverablePhaseSchema.extend({ id: z.string().uuid() }))
    .output(z.string())
    .use(deliverableIdAccessMiddleware)
    .mutation(
      async ({
        ctx: { db },
        input: { id, deliverableId, startDate, endDate }
      }) => {
        const updateValues = {
          ...(startDate && { startDate: formatISO(startDate) }),
          ...(endDate && { endDate: formatISO(endDate) }),
          updatedAt: sql`CURRENT_TIMESTAMP`
        };

        if (Object.keys(updateValues).length > 1) {
          await db
            .update(deliverablePhases)
            .set(updateValues)
            .where(
              and(
                eq(deliverablePhases.id, id),
                eq(deliverablePhases.deliverableId, deliverableId)
              )
            );

          return "OK";
        } else {
          return "Error";
        }
      }
    )
});
