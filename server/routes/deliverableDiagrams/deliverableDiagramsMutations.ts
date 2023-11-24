import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import {
  deliverableDiagramBoundries,
  deliverableDiagramNodes,
} from "../../db/schema";

import { deliverableIdAccessMiddleware } from "./acl";
import {
  UpdatePositionSchema,
  UpsertDeliverableDiagramNodeBoundrySchema,
} from "@/schema/diagrams";
import { eq } from "drizzle-orm";

export const deliverableDiagramsMutations = router({
  createDeliverableDiagramNode: protectedProcedure
    .input(UpsertDeliverableDiagramNodeBoundrySchema)
    .use(deliverableIdAccessMiddleware)
    .output(z.string())
    .mutation(
      async ({
        ctx: { db },
        input: { name, deliverableId, positionX, positionY },
      }) => {
        await db.insert(deliverableDiagramNodes).values({
          deliverableId,
          name,
          positionX,
          positionY,
        });

        return "OK";
      }
    ),
  updateNodePosition: protectedProcedure
    .input(UpdatePositionSchema)
    .output(z.string())
    .mutation(
      async ({ ctx: { db }, input: { nodeId, positionX, positionY } }) => {
        // @TODO: Improve ACL
        await db
          .update(deliverableDiagramNodes)
          .set({
            positionX,
            positionY,
          })
          .where(eq(deliverableDiagramNodes.id, nodeId));

        return "OK";
      }
    ),
  createDeliverableDiagramBoundry: protectedProcedure
    .input(UpsertDeliverableDiagramNodeBoundrySchema)
    .use(deliverableIdAccessMiddleware)
    .output(z.string())
    .mutation(
      async ({
        ctx: { db },
        input: { name, deliverableId, positionX, positionY },
      }) => {
        await db.insert(deliverableDiagramBoundries).values({
          deliverableId,
          name,
          positionX,
          positionY,
        });

        return "OK";
      }
    ),
  updateBoundryPosition: protectedProcedure
    .input(UpdatePositionSchema)
    .output(z.string())
    .mutation(
      async ({ ctx: { db }, input: { nodeId, positionX, positionY } }) => {
        // @TODO: Improve ACL
        await db
          .update(deliverableDiagramBoundries)
          .set({
            positionX,
            positionY,
          })
          .where(eq(deliverableDiagramBoundries.id, nodeId));

        return "OK";
      }
    ),
});
