import { z } from "zod";

export const DeliverableDiagramNodeBoundrySchema = z.object({
  id: z.string().uuid(),
  deliverableId: z.string().uuid(),
  data: z.object({
    label: z.string(),
    description: z.string().optional().nullable(),
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  type: z.string().optional().nullable(),
});

export const UpsertDeliverableDiagramNodeBoundrySchema = z.object({
  name: z.string().min(1, "Node name must contain at least 1 character(s)"),
  description: z.string(),
  deliverableId: z.string().uuid(),
  positionX: z.number(),
  positionY: z.number(),
});
export const UpdateSchema = z.object({
  nodeId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
});

export const UpdatePositionSchema = z.object({
  nodeId: z.string().uuid(),
  positionX: z.number(),
  positionY: z.number(),
});
export const DeletePositionSchema = z.object({
  nodeId: z.string().uuid(),
});

export type UpsertDeliverableDiagramNodeBoundrySchemaType = z.infer<
  typeof UpsertDeliverableDiagramNodeBoundrySchema
>;

export type DeliverableDiagramNodeBoundrySchemaType = z.infer<
  typeof DeliverableDiagramNodeBoundrySchema
>;

export type UpdatePositionSchemaType = z.infer<typeof UpdatePositionSchema>;

export type DeletePositionSchemaType = z.infer<typeof DeletePositionSchema>;
export type UpdateSchemaType = z.infer<typeof UpdateSchema>;