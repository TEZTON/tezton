import { z } from "zod";
import { protectedProcedure, router } from "@/server";

import { deliverableTypesSchema } from "@/server/db/schema";
import { DeliverableTypeSchema } from "@/schema/deliverableType";

export const deliverableTypesQueries = router({
  getTypes: protectedProcedure
    .output(z.array(DeliverableTypeSchema))
    .query(async ({ ctx: { db } }) => {
      return db.select().from(deliverableTypesSchema);
    }),
});
