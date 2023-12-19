import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import {
  deliverableDiagramBoundries,
  deliverableDiagramNodes,
} from "../../db/schema";

import {
  DeletePositionSchema,
  UpdatePositionSchema,
  UpdateSchema,
  UpsertDeliverableDiagramNodeBoundrySchema,
} from "@/schema/diagrams";
import { eq } from "drizzle-orm";
import { deliverableIdAccessMiddleware } from "../deliverablesPhases/acl";

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
  updateDiagram: protectedProcedure
    .input(UpdateSchema)
    .output(z.string())
    .mutation(async ({ ctx: { db }, input: { nodeId, name } }) => {
      await db
        .update(deliverableDiagramNodes)
        .set({
          name
        })
        .where(eq(deliverableDiagramNodes.id, nodeId));
      return "OK";
    }),
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
  deleteDiagram: protectedProcedure
    .input(DeletePositionSchema)
    .output(z.string())
    .mutation(async ({ ctx: { db }, input: { nodeId } }) => {
      await db
        .delete(deliverableDiagramNodes)
        .where(eq(deliverableDiagramNodes.id, nodeId));

      return "OK";
    }),
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
  updateBoundry: protectedProcedure
    .input(UpdateSchema)
    .output(z.string())
    .mutation(async ({ ctx: { db }, input: { nodeId, name } }) => {
      await db
        .update(deliverableDiagramBoundries)
        .set({
          name
        })
        .where(eq(deliverableDiagramBoundries.id, nodeId));
      return "OK";
    }),
  deleteBoundry: protectedProcedure
    .input(DeletePositionSchema)
    .output(z.string())
    .mutation(async ({ ctx: { db }, input: { nodeId } }) => {
      await db
        .delete(deliverableDiagramBoundries)
        .where(eq(deliverableDiagramBoundries.id, nodeId));
      return "OK";
    })
});
