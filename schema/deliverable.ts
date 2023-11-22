import { z } from "zod";

export const DeliverableTypeEnum = z.enum([
  "Ideação",
  "Refinamento",
  "Desenvolvimento",
  "Teste",
  "Piloto",
  "Produção",
]);

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

export const UpsertDeliverableTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Deliverable type name must contain at least 1 character(s)"),
  deliverableId: z.string().uuid().optional().nullable(),
  type: DeliverableTypeEnum,
  endDate: z.date(),
  startDate: z.date(),
});

export type UpsertDeliverableSchemaType = z.infer<
  typeof UpsertDeliverableSchema
>;
export type DeliverableSchemaType = z.infer<typeof DeliverableSchema>;
export type UpsertDeliverableTypeSchemaType = z.infer<
  typeof UpsertDeliverableTypeSchema
>;
