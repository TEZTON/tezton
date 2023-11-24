import { z } from "zod";

export const DeliverableDiagramNodeBoundrySchema = z.object({
  id: z.string().uuid(),
  deliverableId: z.string().uuid(),
  data: z.object({
    label: z.string(),
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const UpsertDeliverableDiagramNodeBoundrySchema = z.object({
  name: z.string().min(1, "Node name must contain at least 1 character(s)"),
  deliverableId: z.string().uuid(),
  positionX: z.number(),
  positionY: z.number(),
});

export const UpdatePositionSchema = z.object({
  nodeId: z.string().uuid(),
  positionX: z.number(),
  positionY: z.number(),
});

export type UpsertDeliverableDiagramNodeBoundrySchemaType = z.infer<
  typeof UpsertDeliverableDiagramNodeBoundrySchema
>;

export type DeliverableDiagramNodeBoundrySchemaType = z.infer<
  typeof DeliverableDiagramNodeBoundrySchema
>;

export type UpdatePositionSchemaType = z.infer<typeof UpdatePositionSchema>;
