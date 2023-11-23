import { z } from "zod";

export const DeliverableSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().nullable().optional(),
});

export const DeliverablePhaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  type: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  createdAt: z.string(),
  updatedAt: z.string(),
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

export const UpsertDeliverablePhaseSchema = z.object({
  name: z
    .string()
    .min(1, "Deliverable type name must contain at least 1 character(s)"),
  deliverableId: z.string().uuid(),
  deliverableTypeId: z.string(),
  endDate: z.date(),
  startDate: z.date(),
  description: z.string().optional().nullable(),
});

export type UpsertDeliverableSchemaType = z.infer<
  typeof UpsertDeliverableSchema
>;
export type DeliverableSchemaType = z.infer<typeof DeliverableSchema>;
export type DeliverablePhaseSchemaType = z.infer<typeof DeliverablePhaseSchema>;

export type UpsertDeliverablePhaseSchemaType = z.infer<
  typeof UpsertDeliverablePhaseSchema
>;
