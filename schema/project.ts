import { z } from "zod";
import axios from "axios";

export const PriorityEnum = z.enum(["Low", "Medium", "High"]);

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().optional().nullable(),
  priority: z.string(),
});

export const UpsertProjectSchema = z.object({
  productId: z.string(),
  projectId: z.string().optional().nullable(),
  name: z.string().min(1, "Product name must contain at least 1 character(s)"),
  description: z.string().optional().nullable(),
  priority: z.optional(PriorityEnum).default("Low"),
});

export const SingleProjectSchema = z.object({
  productId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export type UpsertProjectSchemaType = z.infer<typeof UpsertProjectSchema>;
export type ProjectSchemaType = z.infer<typeof ProjectSchema>;
export type SingleProjectSchemaType = z.infer<typeof SingleProjectSchema>;
