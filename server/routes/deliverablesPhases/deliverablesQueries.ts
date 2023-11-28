import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import { deliverablePhases } from "../../db/schema";
import { eq } from "drizzle-orm";
import { deliverableIdAccessMiddleware } from "./acl";
import { DeliverablePhaseSchema } from "@/schema/deliverable";
import { parseISO } from "date-fns";

export const deliverablePhasesQueries = router({
  getPhases: protectedProcedure
    .input(
      z.object({
        deliverableId: z.string(),
      })
    )
    .use(deliverableIdAccessMiddleware)
    .output(z.array(DeliverablePhaseSchema))
    .query(async ({ ctx: { db, user }, input: { deliverableId } }) => {
      const result = await db
        .select()
        .from(deliverablePhases)

        .where(eq(deliverablePhases.deliverableId, deliverableId));

      return result.map((r) => ({
        ...r,
        startDate: parseISO(r.startDate),
        endDate: parseISO(r.endDate),
      }));
    }),
});
