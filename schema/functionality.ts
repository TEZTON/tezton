import { z } from "zod";

export const FunctionalitySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().nullable().optional(),
});

export const UpsertFunctionalitySchema = z.object({
  projectId: z.string().uuid(),
  functionalityId: z.string().uuid().optional().nullable(),
  name: z
    .string()
    .min(1, "Functionality name must contain at least 1 character(s)"),
  description: z.string().optional().nullable(),
});

export const SingleFunctionalitySchema = z.object({
  projectId: z.string().uuid(),
  functionalityId: z.string().uuid(),
});

export type UpsertFunctionalitySchemaType = z.infer<
  typeof UpsertFunctionalitySchema
>;
export type FunctionalitySchemaType = z.infer<typeof FunctionalitySchema>;
export type SingleFunctionalitySchemaType = z.infer<
  typeof SingleFunctionalitySchema
>;
