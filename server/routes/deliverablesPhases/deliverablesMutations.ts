import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import { deliverableIdAccessMiddleware } from "./acl";
import { UpsertDeliverablePhaseSchema } from "@/schema/deliverable";
import { deliverablePhases } from "../../db/schema";
import { formatISO } from "date-fns";

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
          description,
        },
      }) => {
        await db.insert(deliverablePhases).values({
          deliverableId,
          type: deliverableTypeId,
          endDate: formatISO(endDate),
          name,
          startDate: formatISO(startDate),
          description,
        });

        return "OK";
      }
    ),
});
