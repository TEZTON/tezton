import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().nullable(),
});

export const UpsertProductSchema = z.object({
  companyId: z.string().uuid(),
  productId: z.string().optional().nullable(),
  name: z.string().min(1, "Product name must contain at least 1 character(s)"),
  description: z.string().optional().nullable(),
});

export const SingleProductSchema = z.object({
  companyId: z.string(),
  productId: z.string(),
});

export type UpsertProductSchemaType = z.infer<typeof UpsertProductSchema>;
export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type SingleProductSchemaType = z.infer<typeof SingleProductSchema>;
