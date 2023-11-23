import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import {
  companiesSchema,
  deliverablePhases,
  deliverablesSchema,
  functionalitiesSchema,
  productsSchema,
  projectsSchema,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";

import { deliverableIdAccessMiddleware } from "./acl";
import { DeliverablePhaseSchema } from "@/schema/deliverable";
import { parse, parseISO } from "date-fns";

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
        .leftJoin(
          deliverablesSchema,
          eq(deliverablesSchema.id, deliverablePhases.deliverableId)
        )
        .leftJoin(
          functionalitiesSchema,
          eq(functionalitiesSchema.id, deliverablesSchema.functionalityId)
        )
        .leftJoin(
          projectsSchema,
          eq(projectsSchema.id, functionalitiesSchema.projectId)
        )
        .leftJoin(
          productsSchema,
          eq(productsSchema.id, projectsSchema.productId)
        )
        .leftJoin(
          companiesSchema,
          eq(companiesSchema.id, productsSchema.companyId)
        )
        .where(
          and(
            eq(deliverablesSchema.id, deliverableId),
            eq(companiesSchema.userId, user.id)
          )
        );

      return result.map(({ deliverable_phases }) => ({
        ...deliverable_phases,
        startDate: parseISO(deliverable_phases.startDate),
        endDate: parseISO(deliverable_phases.endDate),
      }));
    }),
});
