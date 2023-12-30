import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import { eq } from "drizzle-orm";
import { DeliverableDiagramNodeBoundrySchema } from "@/schema/diagrams";

import {
  deliverableDiagramBoundries,
  deliverableDiagramNodes,
} from "../../db/schema";
import { deliverableIdAccessMiddleware } from "../deliverablesPhases/acl";

export const deliverableDiagramsQueries = router({
  getNodes: protectedProcedure
    .input(
      z.object({
        deliverableId: z.string(),
      })
    )
    .use(deliverableIdAccessMiddleware)
    .output(z.array(DeliverableDiagramNodeBoundrySchema))
    .query(async ({ ctx: { db }, input: { deliverableId } }) => {
      const nodes = await db
        .select()
        .from(deliverableDiagramNodes)
        .where(eq(deliverableDiagramNodes.deliverableId, deliverableId));

      const result = nodes.map(
        ({ id, deliverableId, name, description, positionX, positionY }) => ({
          id,
          deliverableId,
          position: {
            x: positionX,
            y: positionY,
          },
          data: {
            label: name,
            description: description,
          },
        })
      );

      return result;
    }),

  getBoundries: protectedProcedure
    .input(
      z.object({
        deliverableId: z.string(),
      })
    )
    .use(deliverableIdAccessMiddleware)
    .output(z.array(DeliverableDiagramNodeBoundrySchema))
    .query(async ({ ctx: { db }, input: { deliverableId } }) => {
      const nodes = await db
        .select()
        .from(deliverableDiagramBoundries)
        .where(eq(deliverableDiagramBoundries.deliverableId, deliverableId));

      const result = nodes.map(
        ({ id, deliverableId, name, description, positionX, positionY }) => ({
          id,
          deliverableId,
          position: {
            x: positionX,
            y: positionY,
          },
          data: {
            label: name,
            description: description,
          },
        })
      );

      return result;
    }),
});
