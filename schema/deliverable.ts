import { z } from "zod";

export const DeliverableSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().nullable().optional(),
});

export const UpsertDeliverableSchema = z.object({
  functionalityId: z.string().uuid(),
  deliverableId: z.string().uuid().optional().nullable(),
  name: z
    .string()
    .min(1, "Deliverable name must contain at least 1 character(s)"),
  description: z.string().optional().nullable(),
});

export const SingleDeliverableSchema = z.object({
  functionalityId: z.string().uuid(),
  deliverableId: z.string().uuid(),
});

export type UpsertDeliverableSchemaType = z.infer<
  typeof UpsertDeliverableSchema
>;
export type DeliverableSchemaType = z.infer<typeof DeliverableSchema>;
